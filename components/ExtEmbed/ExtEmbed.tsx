import * as React from 'react';

import './ExtEmbed.scss';

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
}

interface IState {
    isIframeLoaded: boolean;
}

export class ExtEmbed extends React.PureComponent<IProps, IState> {
    public readonly state = { isIframeLoaded: false };

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

        if (this.props.iframeHeight) {
            props.height = this.props.iframeHeight;
        }

        if (this.props.iframeWidth) {
            props.width = this.props.iframeWidth;
        }

        return (
            <div className="ext-embed">
                <iframe {...props} />
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
                    </div>}
            </div>
        );
    }

    private handleIframeLoaded = () => {
        this.setState({ isIframeLoaded: true });
    }
}
