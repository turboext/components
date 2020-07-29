import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-blockid': number;
    'data-width'?: string;
    'data-height'?: string;
}

export function ExtGrattisWidget(props: IProps): React.ReactNode {
    const {
        'data-blockid': blockId,
        'data-width': width = '100%',
        'data-height': height = '250'
    } = props;

    const html = `
<div class="gw_${blockId}"></div>
<script type="text/javascript">
  (function(w, d, n, s, t) {
    w[n] = w[n] || [];
    w[n].push("${blockId}");
    t = d.getElementsByTagName("script")[0];
    s = d.createElement("script");
    s.type = "text/javascript";
    s.src = "//cdn-widget.grattis.ru/widget.min.js?r4";
    s.async = true;
    t.parentNode.insertBefore(s, t);
  })(this, this.document, "grattisWidgets");
</script>
`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={height}
            iframeWidth={width}
        />
    );
}
