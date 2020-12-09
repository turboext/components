import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

type Props = {
    'data-height'?: string;
    'data-width'?: string;
    'data-sid': string;
} & Record<string, string | number | boolean>;

export function ExtPulseWidget(props: Props): React.ReactNode {
    const { 'data-width': dataWidth = '100%', 'data-height': dataHeight = '370', ...rest } = props;

    function isTyleWidgetType(key: string): boolean {
        return key === 'data-widget-type' && rest[key] === 'tyle';
    }

    function getFormattedParam(key: string, value: string | number | boolean): string {
        return `${key}=${value}\t`;
    }

    function getWidgetParams(): string {
        let params = '';

        for (const key in rest) {
            if (key.indexOf('data-') === 0) {
                if (isTyleWidgetType(key)) {
                    params += getFormattedParam(key, 'horizontal');
                } else {
                    params += getFormattedParam(key, rest[key]);
                }
            }
        }
        return params;
    }

    const html = `
      <script async src="https://static.pulse.mail.ru/pulse-widget.js"></script>
      <div class="pulse-widget" ${getWidgetParams()}></div>`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={dataHeight}
            iframeWidth={dataWidth}
        />
    );
}
