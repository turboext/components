import * as React from 'react';
import { render } from 'react-dom';
import { camelCase } from 'camel-case';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

import './ExtZenWidget.scss';

interface IState {
    htmlString: string | null;
    loadingState: LoadingState;
    height: number;
}

const DEFAULT_HEIGHT = 200;
const GLOBAL_CALLBACKS_PROPERTY = 'yandexZenAsyncCallbacks';

enum LoadingState {
    inProgress = 'inProgress',
    succeed = 'succeed',
    failed = 'failed'
}

enum MessageType {
    loadingSucceed = 'loading-succeed',
    loadingFailed = 'loading-failed'
}

interface IMessageData {
    type: string;
    height?: number;
}

type ComponentProps = Record<string, string | number | boolean>;

type WidgetParams = Record<string, string | number | boolean | Function>;

declare global {
    // Расширяем существующий интерфейс Window, поэтому он не может начинаться с I - отключаем eslint
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Window {
        YandexZen: {
            renderWidget: (params: WidgetParams) => void;
        };
    }
}

function inlineScript(window: Window, document: Document, globalCallbackProperty: string, params: WidgetParams): void {
    window[globalCallbackProperty] = window[globalCallbackProperty] || [];
    window[globalCallbackProperty].push(() => {
        params.container = '.widget-container';
        params.successCallback = () => {
            if (typeof window !== 'undefined') {
                const {
                    body,
                    documentElement: html
                } = document;

                /**
                 * Получаем высоту содержимого страницы
                 * @see https://stackoverflow.com/a/1147768/7200211
                 */
                const height = Math.max(
                    body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight
                );

                window.parent.postMessage({ message: 'loading-succeed', height }, '*');
            }
        };
        params.failCallback = () => {
            if (typeof window !== 'undefined') {
                window.parent.postMessage({ message: 'loading-failed' }, '*');
            }
        };
        window.YandexZen.renderWidget(params);
    });
    const script = document.createElement('script');
    script.src = '//zen.yandex.ru/widget-loader';
    script.async = true;
    document.head.appendChild(script);
}

export class ExtZenWidget extends React.PureComponent<ComponentProps, IState> {
    public readonly state = {
        htmlString: null,
        loadingState: LoadingState.inProgress,
        height: DEFAULT_HEIGHT
    };

    private messagesHandlersMap = {
        [MessageType.loadingSucceed]: (messageData: IMessageData) => this.loadingSucceedHandler(messageData),
        [MessageType.loadingFailed]: () => this.loadingFailedHandler()
    };

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', event => this.postMessageHandler(event));
            this.composeHtmlString();
        }
    }

    public render(): React.ReactNode {
        return (
            this.state.loadingState !== LoadingState.failed &&
                <ExtEmbed
                    html={this.state.htmlString || ''}
                    iframeClass="ext-embed__ext-zen-widget"
                    iframeHeight={this.state.height.toString()}
                    isLoaded={this.state.loadingState === LoadingState.succeed}
                />
        );
    }

    private composeHtmlString(): void {
        if (typeof window !== 'undefined') {
            const widgetParams: WidgetParams = {};
            // Преобразуем все пришедшие data-пропсы в параметры виджета
            Object.keys(this.props).forEach(propName => {
                if (propName.indexOf('data-') === 0) {
                    const camelCasedName = camelCase(propName.slice(5));
                    widgetParams[camelCasedName] = this.props[propName];
                }
            });

            const html = (
                <div>
                    <div className="widget-container" />
                    {/* eslint-disable-next-line */}
                    <script dangerouslySetInnerHTML={{ __html:
                            `(${inlineScript.toString()})` +
                            `(window,document,'${GLOBAL_CALLBACKS_PROPERTY}',${JSON.stringify(widgetParams)})` }}
                    />
                </div>
            );

            const tempDiv = document.createElement('div');
            render(html, tempDiv, () => {
                this.setState({ htmlString: tempDiv.innerHTML });
            });
        }
    }

    private postMessageHandler(event: MessageEvent): void {
        const needToProcessMessage = event.data && event.data.message &&
            Object.prototype.hasOwnProperty.call(this.messagesHandlersMap, event.data.message);
        if (needToProcessMessage) {
            this.messagesHandlersMap[event.data.message](event.data);
        }
    }

    private loadingSucceedHandler(messageData: IMessageData): void {
        this.setState({ loadingState: LoadingState.succeed, height: messageData.height || DEFAULT_HEIGHT });
    }

    private loadingFailedHandler(): void {
        this.setState({ loadingState: LoadingState.failed });
    }
}
