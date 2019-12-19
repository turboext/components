import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { camelCase } from 'camel-case';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

import './ExtZenWidget.scss';

interface IState {
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
    // Расширяем существующий интерфейс Window
    // eslint-disable-next-line
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
    public readonly state = { loadingState: LoadingState.inProgress, height: DEFAULT_HEIGHT };

    private messagesHandlersMap = {
        [MessageType.loadingSucceed]: (messageData: IMessageData) => this.loadingSucceedHandler(messageData),
        [MessageType.loadingFailed]: () => this.loadingFailedHandler()
    };

    public componentDidMount(): void {
        window.addEventListener('message', event => this.postMessageHandler(event));
    }

    public render(): React.ReactNode {
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

        return (
            this.state.loadingState !== LoadingState.failed &&
                <ExtEmbed
                    html={renderToString(html)}
                    iframeClass="ext-embed__ext-zen-widget"
                    iframeHeight={this.state.height.toString()}
                    isLoaded={this.state.loadingState === LoadingState.succeed}
                />
        );
    }

    private postMessageHandler(event: MessageEvent): void {
        const needToProcessMessage = event.data && event.data.message &&
            Object.prototype.hasOwnProperty.call(this.messagesHandlersMap, event.data.message);
        if (needToProcessMessage) {
            if (event.data.message === 'loading-succeed') {
                this.setState({ loadingState: LoadingState.succeed, height: event.data.height });
            }
            if (event.data.message === 'loading-failed') {
                this.setState({ loadingState: LoadingState.failed });
            }
        }
    }

    private loadingSucceedHandler(messageData: IMessageData): void {
        this.setState({ loadingState: LoadingState.succeed, height: messageData.height || DEFAULT_HEIGHT });
    }

    private loadingFailedHandler(): void {
        this.setState({ loadingState: LoadingState.failed });
    }
}
