import * as React from 'react';

import './ExtEmbed.scss';

type CallbackFunction = (event: MessageEvent) => void;

interface IProps {

    /**
     * Html-разметка встраиваемого компонента
     */
    html: string;

    /**
     * Css-класс для тега iframe
     */
    iframeClass?: string;

    /**
     * Ширина для тега iframe
     */
    iframeWidth?: string;

    /**
     * Высота для тега iframe
     */
    iframeHeight?: string;

    /**
     * Признак, загрузился ли встраиваемый виджет
     */
    isLoaded?: boolean;

    /**
     * Колбек, который нужно вызвать при получении postMessage
     */
    onMessage?: CallbackFunction;
}

interface IState {
    isIframeLoaded: boolean;
}

export class ExtEmbed extends React.PureComponent<IProps, IState> {
    public readonly state = { isIframeLoaded: false };

    private iframeRef: React.RefObject<HTMLIFrameElement> = React.createRef();

    public componentDidMount(): void {
        if (typeof window === 'undefined') {
            return;
        }
        window.addEventListener('message', event => this.handlePostMessage(event));
    }

    public render(): React.ReactNode {
        const {
            html,
            iframeClass,
            isLoaded: isEmbedLoaded
        } = this.props;

        const sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';

        const innerHtml = encodeURIComponent(html);
        const src = `https://yastatic.net/s3/turbo-static/embed-sandbox/default.html#html=${innerHtml}`;

        // Если isLoaded не передается в props'ах, убираем loader, когда iframe стриггерит событие onload
        const isLoaded = typeof isEmbedLoaded === 'undefined' ? this.state.isIframeLoaded : isEmbedLoaded;

        const props: React.HTMLProps<HTMLIFrameElement> = {
            allowFullScreen: false,
            className: `ext-embed__iframe ${iframeClass || ''}`,
            onLoad: this.handleIframeLoaded,
            sandbox,
            scrolling: 'no',
            src
        };

        return (
            <div className="ext-embed" style={{ height: isLoaded ? '' : `${this.props.iframeHeight}px` }}>
                {innerHtml &&
                    <iframe
                        height={this.props.iframeHeight}
                        ref={this.iframeRef}
                        width={this.props.iframeWidth}
                        {...props}
                    />
                }
                {!isLoaded &&
                    <div className="ext-embed__loader">
                        <div className="ext-embed__loader-inner">
                            <div className="ext-embed__loader-text">Загрузка</div>
                            <div className="ext-embed__loader-dots">
                                <div className="ext-embed__loader-dot" />
                                <div className="ext-embed__loader-dot" />
                                <div className="ext-embed__loader-dot" />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    private handleIframeLoaded = () => {
        this.setState({ isIframeLoaded: true });
    }

    private handlePostMessage(event: MessageEvent): void {
        const needToProcessMessage =
            this.iframeRef.current &&
            event.source === this.iframeRef.current.contentWindow &&
            event.data;

        if (needToProcessMessage) {
            this.props.onMessage && this.props.onMessage(event);
        }
    }
}
