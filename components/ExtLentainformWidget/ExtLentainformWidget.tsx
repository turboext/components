import * as React from 'react';
import { render } from 'react-dom';
import { camelCase } from 'camel-case';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

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

const DEFAULT_HEIGHT = 320;


type WidgetParams = Record<string, string>;

function inlineScript(window: Window, document: Document, url: string): void {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
}

export class ExtLentainformWidget extends React.PureComponent {
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
        return this.state.loadingState === LoadingState.failed ?
            null :
            (
                <ExtEmbed
                    html={this.state.htmlString || ''}
                    iframeClass="ext-embed__ext-lentainform-widget"
                    iframeHeight={this.state.height.toString()}
                    isLoaded={this.state.loadingState === LoadingState.succeed}
                />
            );
    }

    private makeScriptUrl(params: WidgetParams): string {
        const publisherStr = params.publisher.replace(/[^A-z0-9]/g, '');
        return `https://jsc.lentainform.com/${publisherStr[0]}/${publisherStr[1]}/` +
            `${encodeURIComponent(params.publisher)}.` +
            `${encodeURIComponent(params.widget)}.js`;
    }

    private composeHtmlString(): void {
        if (typeof window !== 'undefined') {
            const widgetParams: WidgetParams = {};
            Object.keys(this.props).forEach(propName => {
                if (propName.indexOf('data-') === 0) {
                    const camelCasedName = camelCase(propName.slice(5));
                    widgetParams[camelCasedName] = this.props[propName];
                }
            });

            const html = (
                <div>
                    <div data-widget={widgetParams.widget} id={widgetParams.container} />
                    {/* eslint-disable-next-line */}
                    <script dangerouslySetInnerHTML={{ __html: `(${inlineScript.toString()})` +
                            `(window,document, ${JSON.stringify(this.makeScriptUrl(widgetParams))})` }}
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
