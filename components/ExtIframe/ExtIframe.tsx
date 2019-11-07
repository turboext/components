import * as React from 'react';

interface IExtIframeProps {
    frameSrc: string;
    className?: string;
    frameAttrs?: React.IframeHTMLAttributes<HTMLIFrameElement>;
}

export class ExtIframe extends React.PureComponent<IExtIframeProps> {
    public render(): JSX.Element {
        const frameAttrs = this.props.frameAttrs || null;
        const sandbox = 'allow-forms allow-scripts allow-same-origin';

        return (
            <iframe
                {...frameAttrs}
                allowFullScreen={false}
                className={this.props.className}
                frameBorder={0}
                sandbox={sandbox}
                scrolling="no"
                src={this.props.frameSrc}
            />
        );
    }
}
