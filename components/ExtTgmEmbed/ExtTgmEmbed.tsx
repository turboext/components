import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-post'?: string;
}

export function ExtTgmEmbed(props: IProps): React.ReactNode {
    const {
        'data-post': postName
    } = props;

    const html = `<script async src="https://telegram.org/js/telegram-widget.js?14" 
    data-telegram-post="${postName}" 
    data-width="100%"></script>`;

    return (
        <ExtEmbed
            html={html}
        />
    );
}
