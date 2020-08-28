/**
 * ©2020 SMI2, Dmitry Gladkikh, Maxim Skvortsov
 */

import './ExtSmi2Widget.scss';

import * as React from 'react';
import { render } from 'react-dom';

import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IState {
    htmlString: string;
    loadingState: LoadingState;
    height: number;
    width?: number;
}

const DEFAULT_HEIGHT = 300;

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
    'data-block_id': string;
    'data-height': number;
    'data-width'?: number;
} & Record<string, string | number | boolean>;

function inlineScript(document: Document, blockId: number): void {
    const script = document.createElement('script');
    script.src = `//smi2.ru/data/js/${blockId}.js`;
    script.async = true;
    document.head.appendChild(script);
}

export class ExtSmi2Widget extends React.PureComponent<ComponentProps, IState> {
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
                        iframeClass="ext-embed__ext-smi2-widget"
                        iframeHeight={height.toString()}
                        isLoaded
                        {...(width && {
                            iframeClass: '',
                            iframeWidth: width.toString()
                        })}
                        onMessage={this.handlePostMessage}
                    />
                )}
            </>
        );
    }

    private composeHtmlString(): void {
        if (typeof window !== 'undefined') {
            const { 'data-block_id': blockId } = this.props;

            const html = (
                <div>
                    <div className={`unit_${blockId}`} id={`unit_${blockId}`} />
                    {/* eslint-disable-next-line */}
                    <script dangerouslySetInnerHTML={{
                        __html: `(${inlineScript.toString()})(document,${blockId})`
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

    private handleLoadingSucceed({ height, width }: IMessageData): void {
        this.setState({
            loadingState: LoadingState.succeed,
            height: height || DEFAULT_HEIGHT,
            width
        });
    }

    private handleLoadingFailed(): void {
        this.setState({
            loadingState: LoadingState.failed
        });
    }
}
