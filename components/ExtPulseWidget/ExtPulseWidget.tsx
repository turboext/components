import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

enum WidgetType {
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}
type Props = {
    'data-height'?: string;
    'data-width'?: string;
    'data-sid': string;
    'data-widget-type': WidgetType;
} & Record<string, string | number | boolean>;

export function ExtPulseWidget(props: Props): React.ReactNode {
    const { 'data-width': dataWidth = '100%', 'data-height': dataHeight = '388', ...rest } = props;

    function isAnotherWidgetType(key: string): boolean {
        return key === 'data-widget-type' &&
        (rest[key].indexOf(WidgetType.Horizontal) < 0 ||
        rest[key].indexOf(WidgetType.Vertical) < 0);
    }

    function getFormattedParam(key: string, value: string | number | boolean): string {
        if (isAnotherWidgetType(key)) {
            return `${key}=${WidgetType.Horizontal}`;
        }
        return `${key}=${value}`;
    }

    const params = Object.keys(rest).filter(key => key.indexOf('data-') === 0)
        .map(key => getFormattedParam(key, rest[key]))
        .join(' ');

    const html = `
      <script async src="https://static.pulse.mail.ru/pulse-widget.js"></script>
      <div class="pulse-widget" ${params}></div>`;

    return (
        <ExtEmbed
            html={html}
            iframeHeight={dataHeight}
            iframeWidth={dataWidth}
        />
    );
}
