import * as React from 'react';

import { inlineScript } from './inlineScript';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-post'?: string;
}

interface IState {
    height?: string;
}

export class ExtTgmEmbed extends React.PureComponent<IProps, IState> {
    public state: IState = {};

    public render(): React.ReactNode {
        const {
            'data-post': postName
        } = this.props;

        const html = `<script async src="https://telegram.org/js/telegram-widget.js?14" 
        data-telegram-post="${postName}" 
        data-width="100%"></script>
        <script>(${inlineScript.toString()})()</script>
        `;

        return (
            <ExtEmbed
                html={html}
                iframeHeight={this.state.height}
                iframeWidth="100%"
                onMessage={this.handleMessage}
            />
        );
    }

    private handleMessage = ({ data }: MessageEvent): void => {
        if (data.event === 'resize') {
            this.setState({ height: `${data.height}px` });
        }
    };
}
