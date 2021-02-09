import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-bid': number;
    'data-height'?: string;
}

export function ExtSmiCenterWidget(props: IProps): React.ReactNode {
    const {
        'data-bid': blockId,
        'data-height': height = '300'
    } = props;

    const html = `<div id="bt-${Number(blockId)}" ></div>` +
        `<script async src="https://smicenter.ru/static/b/${Number(blockId)}/t.js"></script>`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth="100%"
        />
    );
}
