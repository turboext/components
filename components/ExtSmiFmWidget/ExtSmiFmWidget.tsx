import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-bid': number;
    'data-width'?: string;
    'data-height'?: string;
}

export function ExtSmiFmWidget(props: IProps): React.ReactNode {
    const {
        'data-bid': blockId,
        'data-height': height = '300'
    } = props;

    const html = `<script async src="https://static.mirror.smi.fm/gen2/js/yandexTurbo.js"></script>
<div class="no24_teaser" data-bid="${Number(blockId)}"></div>`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth="100%"
        />
    );
}
