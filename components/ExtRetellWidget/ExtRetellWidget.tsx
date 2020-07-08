import * as React from 'react';
import { render } from 'react-dom';
import { camelCase } from 'camel-case';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-url': string;
    'data-source'?: string;
    'data-theme'?: string;
    'data-rate'?: string | number;
    [key: string]: string | number | undefined;
}

interface IState {
    loadingState: LoadingState;
    finalHtml: string;
}

interface IWidgetOptions {
    url: string;
    source?: string;
    theme?: string;
    rate?: string | number;
    [key: string]: string | number | undefined;
}

enum LoadingState {
    loading = 'loading',
    ready = 'ready',
    failed = 'failed'
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
        window.addEventListener('message', event => this.handlePostMessage(event));
        this.makeHtml();
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
        const options: IWidgetOptions = this.getWidgetOptions();

        return `Speechki.init(${JSON.stringify(options)})`;
    }

    private getWidgetOptions(): IWidgetOptions {
        return Object.keys(this.props).reduce((prev, cur) => {
            if (cur.indexOf('data-') === 0) {
                prev[camelCase(cur.replace('data-', ''))] = this.props[cur];
            }

            return prev;
        }, {} as unknown as IWidgetOptions);
    }

    private handlePostMessage(event: MessageEvent): void {
        if (event.data && event.data.type && this.messagesHandlersMap[event.data.type]) {
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
