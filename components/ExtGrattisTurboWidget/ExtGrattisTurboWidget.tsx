import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-blockid': number;
    'data-width'?: string;
    'data-height'?: string;
}

const canUseDom = typeof window !== 'undefined' && Boolean(window.document);

export function ExtGrattisTurboWidget(props: IProps): React.ReactNode {
    const {
        'data-blockid': blockId,
        'data-width': width = '100%',
        'data-height': height = '559'
    } = props;

    const KEY = 'grattisWidgets';
    const URL_WIDGET_JS = '//cdn-widget.grattis.ru/widget-turbo.min.js';


    let title = '';
    let url = '';

    if (canUseDom) {
        const H1 = document.getElementsByTagName('h1');

        if (H1 && H1.length > 0) {
            title = H1[0].innerText;
        } else {
            ({ title } = document);
        }

        url = location ? `${location.protocol}//${location.host}${location.pathname}` : '';
    }

    const html = canUseDom ? `
<div class="gw_${blockId}"></div>
<script type="text/javascript">
    (function(w, d, n, s, t) {
    w[n] = w[n] || [];
    w[n].push({i: "${blockId}", t: "${title}", u: "${url}"});
    t = d.getElementsByTagName("script")[0];
    s = d.createElement("script");
    s.type = "text/javascript";
    s.src = "${URL_WIDGET_JS}";
    s.async = true;
    t.parentNode.insertBefore(s, t);
    })(this, this.document, "${KEY}");
</script>
` : '';

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth={width}
        />
    );
}
