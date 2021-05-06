import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-blockid': number;
    'data-width'?: number | string;
    'data-height'?: number | string;
}

interface IState {
    htmlString: string;
    loadingState: LoadingState;
    height: number;
}

enum LoadingState {
    inProgress = 'inProgress',
    succeed = 'succeed',
    failed = 'failed'
}

enum MessageType {
    onRender = 'onRender',
    onResize = 'onResize',
    onError = 'onError',
}

interface IMessageData {
    message: MessageType;
    height?: number;
}

interface IWidgetEvent {
    height: number;
}

function inlineScript(containerId: string, blockId: number): void {
    if (typeof window !== 'undefined') {
        (window['smiq'] = window['smiq'] || []).push({
            element: document.getElementById(containerId),
            blockId,
            onRender: () => {
                window.parent.postMessage({
                    message: 'onRender'
                }, '*');
            },
            onResize: (event: IWidgetEvent) => {
                window.parent.postMessage({
                    message: 'onResize',
                    height: event.height
                }, '*');
            },
            onError: () => {
                window.parent.postMessage({
                    message: 'onError'
                }, '*');
            }
        });
    }
}

const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = 250;

export class Ext24smiWidget extends React.PureComponent<IProps, IState> {
    public readonly state: IState = {
        htmlString: '',
        loadingState: LoadingState.inProgress,
        height: DEFAULT_HEIGHT
    };

    private messagesHandlersMap = {
        [MessageType.onRender]: () => this.handleOnRender(),
        [MessageType.onResize]: (data: IMessageData) => this.handleOnResize(data),
        [MessageType.onError]: () => this.handleOnError()
    };

    private constructor(props: IProps) {
        super(props);
        this.handlePostMessage = this.handlePostMessage.bind(this);
    }

    public componentDidMount(): void {
        const tempDiv = document.createElement('div');
        render(this.html(), tempDiv, () => {
            this.setState({ htmlString: tempDiv.innerHTML });
        });
    }

    public render(): React.ReactNode {
        const {
            'data-width': iframeWidth = DEFAULT_WIDTH,
            'data-height': iframeHeight = ''
        } = this.props;
        const { htmlString, loadingState, height } = this.state;

        return loadingState !== LoadingState.failed && (
            <ExtEmbed
                html={htmlString}
                iframeHeight={iframeHeight.toString() || height.toString()}
                iframeWidth={iframeWidth.toString()}
                isLoaded={loadingState === LoadingState.succeed}
                onMessage={this.handlePostMessage}
            />
        );
    }

    private html(): JSX.Element {
        const { 'data-blockid': blockId } = this.props;
        const containerId = `smi24_${blockId}`;

        return (
            <>
                <script async src="https://jsn.24smi.net/smi.js" />
                <div id={containerId} />
                {/* eslint-disable-next-line */}
                <script dangerouslySetInnerHTML={{
                    __html: `(${inlineScript.toString()})('${containerId}', ${blockId})`
                }}
                />
            </>
        );
    }

    private handlePostMessage(event: MessageEvent): void {
        const needToProcessMessage =
            event.data &&
            event.data.message &&
            Object.prototype.hasOwnProperty.call(this.messagesHandlersMap, event.data.message);

        if (needToProcessMessage) {
            this.messagesHandlersMap[event.data.message](event.data);
        }
    }

    private handleOnRender(): void {
        this.setState({ loadingState: LoadingState.succeed });
    }

    private handleOnResize(data: IMessageData): void {
        this.setState({ height: data.height || DEFAULT_HEIGHT });
    }

    private handleOnError(): void {
        this.setState({ loadingState: LoadingState.failed });
    }
}
