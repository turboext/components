import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

import './ExtStrossleWidget.scss';

interface IProps {
    ['data-widget']: string;
    ['data-height']: string;
}

interface IState {
    htmlString: string | null;
}

const DEFAULT_HEIGHT = '290';

export class ExtStrossleWidget extends React.PureComponent<IProps, IState> {
    public readonly state = { htmlString: null };

    private html = (
        <div
            data-spklw-widget={this.props['data-widget']}
        >
            <script async src="https://widgets.sprinklecontent.com/v2/sprinkle.js" />
        </div>
    );

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            const tempDiv = document.createElement('div');
            render(this.html, tempDiv, () => {
                this.setState({ htmlString: tempDiv.innerHTML });
            });
        }
    }

    public render(): React.ReactNode {
        if (!this.state.htmlString) {
            return null;
        }

        return (
            <ExtEmbed
                html={this.state.htmlString || ''}
                iframeClass="ext-embed__ext-strossle-widget"
                iframeHeight={this.props['data-height'] || DEFAULT_HEIGHT}
            />
        );
    }
}
