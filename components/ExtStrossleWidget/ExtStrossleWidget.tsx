import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

import './ExtStrossleWidget.scss';

interface IWidgetStrossleProps {
    ['data-widget']: string;
}

export class ExtStrossleWidget extends React.PureComponent<IWidgetStrossleProps> {
    private html = (
        <div
            data-spklw-widget={this.props['data-widget']}
        >
            <script async src="https://widgets.sprinklecontent.com/v2/sprinkle.js" />
        </div>
    );

    public render(): React.ReactNode {
        if (typeof window !== 'undefined') {
            const tempDiv = document.createElement('div');
            render(this.html, tempDiv);

            return (
                <ExtEmbed
                    html={tempDiv.innerHTML}
                    iframeClass="ext-embed__ext-strossle-widget"
                />
            );
        }

        return null;
    }
}
