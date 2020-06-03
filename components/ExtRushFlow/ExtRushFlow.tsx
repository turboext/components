import * as React from 'react';
import { render } from 'react-dom';
import { camelCase } from 'camel-case';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

import './ExtRushFlow.scss';

interface IState {
    htmlString: string | null;
    loadingState: LoadingState;
    width: number;
    height: number;
    style: string;
}

interface IRushFlowProps {
    ['data-cid']: string;
    ['data-preloader']: boolean;
    ['data-width']: number;
    ['data-height']: number;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 100;
const GLOBAL_CALLBACKS_PROPERTY = 'rushFlowAsyncCallbacks';
const DEFAULT_LOADING_STATE = true;

enum LoadingState {
    inProgress = 'inProgress',
    succeed = 'succeed',
    failed = 'failed'
}

enum MessageType {
    loadingSucceed = 'loading-succeed',
    loadingFailed = 'loading-failed',
    hideComponent = 'hide-component',
    changeComponentStyle = 'change-component-style',
    getLocation = 'get-location',
    saveLocation = 'save-location',
}

interface IMessageData {
    type: string;
    width?: number;
    height?: number;
    style?: string;
}

interface IMessageHandlerArguments {
    messageData: IMessageData;
}

declare global {
    // Расширяем существующий интерфейс Window, поэтому он не может начинаться с I - отключаем eslint
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Window {
        RushFlow: {
            renderComponent: (params: WidgetParams) => void;
        };
    }
}
type WidgetParams = Record<string, string | number | boolean | Function>;

function inlineScript(window: Window, document: Document, globalCallbackProperty: string, params: WidgetParams): void {
    const componentPostUid = params.uid;
    window[globalCallbackProperty] = window[globalCallbackProperty] || [];
    window[globalCallbackProperty].push(() => {
        params.container = '.component-container';
        params.successCallback = (fixedWidth: string, fixedHeight: string, styleData: string) => {
            if (typeof window !== 'undefined') {
                const {
                    body,
                    documentElement: html
                } = document;

                const width = fixedWidth || Math.max(
                    body.scrollWidth, body.offsetWidth,
                    html.clientWidth, html.scrollWidth, html.offsetWidth
                );

                const height = fixedHeight || Math.max(
                    body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight
                );

                const style = styleData || '';

                window.parent.postMessage({ message: `${componentPostUid}loading-succeed`, width, height, style }, '*');
            }
        };
        params.failCallback = () => {
            if (typeof window !== 'undefined') {
                window.parent.postMessage({ message: `${componentPostUid}loading-failed` }, '*');
            }
        };
        params.hideComponentCallback = () => {
            if (typeof window !== 'undefined') {
                window.parent.postMessage({ message: `${componentPostUid}hide-component` }, '*');
            }
        };
        params.changeComponentStyleCallback = (styleData: string) => {
            if (typeof window !== 'undefined') {
                const style = styleData || '';
                window.parent.postMessage({ message: `${componentPostUid}change-component-style`, style }, '*');
            }
        };
        window.RushFlow.renderComponent(params);
    });

    const rnd = Math.random() * 10;
    const script = document.createElement('script');
    script.src = `//rushflow.ru/component-loader?rnd=${rnd}`;
    script.async = true;
    document.head.appendChild(script);
}

export class ExtRushFlow extends React.PureComponent<IRushFlowProps, IState> {
    public readonly state = {
        htmlString: null,
        loadingState: LoadingState.inProgress,
        width: this.props['data-width'] || DEFAULT_WIDTH,
        height: this.props['data-height'] || DEFAULT_HEIGHT,
        style: '',
        componentPostUid: `${this.props['data-cid']}_${new Date().getTime()
            .toString()}_`
    };

    private messagesHandlersMap = {
        [this.state.componentPostUid + MessageType.loadingSucceed]:
        ({ messageData }: IMessageHandlerArguments) => this.loadingSucceedHandler(messageData),
        [this.state.componentPostUid + MessageType.loadingFailed]: () => this.loadingFailedHandler(),
        [this.state.componentPostUid + MessageType.hideComponent]: () => this.hideComponentHandler(),
        [this.state.componentPostUid + MessageType.changeComponentStyle]:
        ({ messageData }: IMessageHandlerArguments) => this.changeComponentStyleHandler(messageData)
    }

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', event => this.postMessageHandler(event));
            this.composeHtmlString();
        }
    }

    public render(): React.ReactNode {
        return this.state.loadingState === LoadingState.failed ?
            null :
            (
                <ExtEmbed
                    html={this.state.htmlString || ''}
                    iframeClass={`ext-embed__ext-rush-flow${this.state.style.toString() || '__hidden'}`}
                    iframeHeight={this.state.height.toString()}
                    iframeWidth={this.state.width.toString()}
                    isLoaded={this.props['data-preloader'] ? this.state.loadingState === LoadingState.succeed : DEFAULT_LOADING_STATE}
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

            widgetParams['uid'] = this.state.componentPostUid;

            const html = (
                <div>
                    <div className="component-container" />
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
            this.messagesHandlersMap[event.data.message]({
                messageData: event.data
            });
        }
    }

    private loadingSucceedHandler(messageData: IMessageData): void {
        this.setState({ loadingState: LoadingState.succeed, width: messageData.width || DEFAULT_WIDTH, height: messageData.height || DEFAULT_HEIGHT, style: messageData.style || '' });
    }

    private loadingFailedHandler(): void {
        this.setState({ loadingState: LoadingState.failed });
    }

    private hideComponentHandler(): void {
        this.setState({ style: '__hidden' });
    }

    private changeComponentStyleHandler(messageData: IMessageData): void {
        this.setState({ style: messageData.style || '' });
    }
}
