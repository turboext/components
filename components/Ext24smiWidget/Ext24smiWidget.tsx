import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-blockid': number;
    'data-width'?: string;
    'data-height'?: string;
}

export function Ext24smiWidget(props: IProps): React.ReactNode {
    const {
        'data-blockid': blockId,
        'data-width': width = '100%',
        'data-height': height = '250'
    } = props;

    const html = `
<script async src="https://jsn.24smi.net/smi.js"></script>
<div class="smi24__informer smi24__auto" data-smi-blockid="${blockId}"></div>
`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth={width}
        />
    );
}
