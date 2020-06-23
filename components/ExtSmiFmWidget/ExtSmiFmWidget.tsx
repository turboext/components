import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-bid': number;
    'data-height'?: string;
}

export function ExtSmiFmWidget(props: IProps): React.ReactNode {
    const {
        'data-bid': blockId,
        'data-height': height = '300'
    } = props;

    const html = `<script async src="https://smi.fm/js/turbo-block/${Number(blockId)}.js"></script>
<div class="no24_teaser" data-bid="${Number(blockId)}"></div>`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth="100%"
        />
    );
}
