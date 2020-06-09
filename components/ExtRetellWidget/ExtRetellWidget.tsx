import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-article-url': string;
    'data-source'?: string;
    'data-theme'?: string;
}

interface IState {
    loadingState: LoadingState;
    finalHtml: string;
}

interface IWidgetOptions {
    url: string;
    source?: string;
    theme?: string;
}

enum LoadingState {
    loading = 'loading',
    ready = 'ready',
    failed = 'feailed'
}

enum MessageType {
    RetellWidgetReady = 'RetellWidgetReady',
    RetelllWidgetError = 'RetellWidgetError'
}

const DEFAULT_HEIGHT = '60';
const DEFAULT_WIDTH = '100%';

function inlineScript(document: Document, callback: Function): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//widget.speechki.org/js/common.min.js';
    script.onload = () => {
        callback();
    };
    document.head.appendChild(script);
}

export class ExtRetellWidget extends React.PureComponent<IProps, IState> {
    public readonly state: IState = {
        loadingState: LoadingState.loading,
        finalHtml: ''
    }

    private messagesHandlersMap = {
        [MessageType.RetellWidgetReady]: () => this.handleWidgetReady(),
        [MessageType.RetelllWidgetError]: () => this.handleWidgetError()
    }

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', event => this.handlePostMessage(event));
            this.makeHtml();
        }
    }

    public render(): React.ReactNode {
        const { loadingState, finalHtml } = this.state;

        return (
            <>
                {loadingState !== LoadingState.failed && (
                    <ExtEmbed
                        html={finalHtml}
                        iframeHeight={DEFAULT_HEIGHT}
                        iframeWidth={DEFAULT_WIDTH}
                        isLoaded={loadingState === LoadingState.ready}
                    />
                )}
            </>
        );
    }

    private makeHtml(): void {
        if (typeof window !== 'undefined') {
            const initializer = this.makeInitializer();

            const html = (
                <div>
                    <script
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                            __html: `(${inlineScript.toString()})(document, function() { ${initializer} })`
                        }} data-voiced="player"
                    />
                </div>
            );

            const wrapper = document.createElement('div');
            render(html, wrapper, () => {
                this.setState({ finalHtml: wrapper.innerHTML });
            });
        }
    }

    private makeInitializer(): string {
        const {
            'data-article-url': articleUrl,
            'data-source': source,
            'data-theme': theme
        } = this.props;

        let initializer = 'Speechki.init(';
        const options: IWidgetOptions = {
            url: articleUrl
        };

        if (typeof source !== 'undefined') {
            options.source = source;
        }

        if (typeof theme !== 'undefined') {
            options.theme = theme;
        }

        initializer += `${JSON.stringify(options)})`;

        return initializer;
    }

    private handlePostMessage(event: MessageEvent): void {
        const needToProcessMessage = event.data && event.data.type &&
        Object.prototype.hasOwnProperty.call(this.messagesHandlersMap, event.data.type);

        if (needToProcessMessage) {
            this.messagesHandlersMap[event.data.type](event.data);
        }
    }

    private handleWidgetReady(): void {
        this.setState({
            loadingState: LoadingState.ready
        });
    }

    private handleWidgetError(): void {
        this.setState({
            loadingState: LoadingState.failed
        });
    }
}
