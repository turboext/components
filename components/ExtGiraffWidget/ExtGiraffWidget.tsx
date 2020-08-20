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

function inlineScript(document: Document, domain: string, blockName: string): void {
    if (typeof window !== 'undefined') {
        window['giraff_iframe_mode'] = true;
        const script = document.createElement('script');
        const serverName = domain || 'code.giraff.io';
        script.src = `//${encodeURIComponent(serverName)}/data/widget-${encodeURIComponent(blockName)}.js`;
        script.async = true;
        document.head.appendChild(script);
    }
}

export class ExtGiraffWidget extends React.PureComponent<ComponentProps, IState> {
    public readonly state: IState = {
        htmlString: '',
        loadingState: LoadingState.inProgress,
        height: DEFAULT_HEIGHT
    };

    private messagesHandlersMap = {
        [MessageType.loadingSucceed]: (messageData: IMessageData) => this.handleLoadingSucceed(messageData),
        [MessageType.loadingFailed]: () => this.handleLoadingFailed()
    };

    private constructor(props: ComponentProps) {
        super(props);
        this.handlePostMessage = this.handlePostMessage.bind(this);
    }

    public componentDidMount(): void {
        if (typeof window === 'undefined') {
            return;
        }
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
                        iframeWidth={width ? width.toString() : '100%'}
                        isLoaded={loadingState === LoadingState.succeed}
                        onMessage={this.handlePostMessage}
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
                        __html: `(${inlineScript.toString()})(document,'${serverName || ''}','${blockName}')`
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

    private handlePostMessage(event: MessageEvent): void {
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

    private handleLoadingSucceed({ height }: IMessageData): void {
        this.setState({
            loadingState: LoadingState.succeed,
            height: height || DEFAULT_HEIGHT
        });
    }

    private handleLoadingFailed(): void {
        this.setState({
            loadingState: LoadingState.failed
        });
    }
}
