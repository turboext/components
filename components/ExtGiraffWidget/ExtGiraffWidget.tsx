import * as React from 'react';
import { render } from 'react-dom';

import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IState {
    htmlString: string;
    loadingState: LoadingState;
    height: number;
    width?: number;
}

const DEFAULT_HEIGHT = 600;

enum LoadingState {
    inProgress = 'inProgress',
    succeed = 'succeed',
    failed = 'failed',
}

enum MessageType {
    loadingSucceed = 'loading-succeed',
    loadingFailed = 'loading-failed',
}

interface IMessageData {
    type: string;
    height?: number;
    width?: number;
}

type ComponentProps = {
    'data-widget-id': string;
    'data-server-name'?: string;
    'data-height': number;
    'data-width'?: number;
    'data-block-name': string;
} & Record<string, string | number | boolean>;

function inlineScript(document: Document, blockId: number, domain: string, blockName: string): void {
    const script = document.createElement('script');
    const serverName = domain || 'code.giraff.io';
    script.src = `//${encodeURIComponent(serverName)}/data/widget-${encodeURIComponent(blockName)}.js`;
    script.async = true;
    document.head.appendChild(script);
}

export class ExtGiraffadvertWidget extends React.PureComponent<ComponentProps, IState> {
    public readonly state: IState = {
        htmlString: '',
        loadingState: LoadingState.inProgress,
        height: DEFAULT_HEIGHT
    };

    private messagesHandlersMap = {
        [MessageType.loadingSucceed]: (messageData: IMessageData) => this.loadingSucceedHandler(messageData),
        [MessageType.loadingFailed]: () => this.loadingFailedHandler()
    };

    public componentDidMount(): void {
        if (typeof window === 'undefined') {
            return;
        }
        window.addEventListener('message', event => this.postMessageHandler(event));
        this.initDimensions();
        this.composeHtmlString();
    }

    public render(): React.ReactNode {
        const { width, height, htmlString, loadingState } = this.state;
        return (
            <>
                {loadingState !== LoadingState.failed && (
                    <ExtEmbed
                        html={htmlString}
                        iframeHeight={height.toString()}
                        isLoaded
                        {...(width && {
                            iframeWidth: width.toString()
                        })}
                    />
                )}
            </>
        );
    }

    private composeHtmlString(): void {
        if (typeof window !== 'undefined') {
            const { 'data-widget-id': blockId, 'data-server-name': serverName, 'data-block-name': blockName } = this.props;

            const html = (
                <div>
                    <div id={`grf_${blockName}_${blockId}`} />
                    {/* eslint-disable-next-line */}
                    <script dangerouslySetInnerHTML={{
                        __html: `(${inlineScript.toString()})(document,${blockName},'${serverName || ''}')`
                    }}
                    />
                </div>
            );

            const tempDiv = document.createElement('div');
            render(html, tempDiv, () => {
                this.setState({ htmlString: tempDiv.innerHTML });
            });
        }
    }

    private initDimensions(): void {
        const { 'data-width': width, 'data-height': height } = this.props;
        this.setState({
            height: height || DEFAULT_HEIGHT,
            width
        });
    }

    private postMessageHandler(event: MessageEvent): void {
        const needToProcessMessage =
            event.data &&
            event.data.message &&
            Object.prototype.hasOwnProperty.call(
                this.messagesHandlersMap,
                event.data.message
            );
        if (needToProcessMessage) {
            this.messagesHandlersMap[event.data.message](event.data);
        }
    }

    private loadingSucceedHandler({ height, width }: IMessageData): void {
        this.setState({
            loadingState: LoadingState.succeed,
            height: height || DEFAULT_HEIGHT,
            width
        });
    }

    private loadingFailedHandler(): void {
        this.setState({
            loadingState: LoadingState.failed
        });
    }
}
