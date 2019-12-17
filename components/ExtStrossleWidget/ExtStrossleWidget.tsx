import * as React from 'react';
<<<<<<< HEAD

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IWidgetStrossleProps {}

export class ExtStrossleWidget extends React.PureComponent<IWidgetStrossleProps> {
    private div = React.createRef<HTMLDivElement>()

    public componentDidMount(): void {
        const script = document.createElement('script');
        script.async = true;
        script.src = '//widgets.sprinklecontent.com/v2/sprinkle.js';
        if (this.div) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const node = this.div.current!;
            node.appendChild(script);
        }
    }

    public render(): React.ReactNode {
        return (
            <div
                data-spklw-widget={this.props['data-widget']}
                ref={this.div}
            />
        );
=======
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
>>>>>>> Поддержано добавление эмбедов на Турбо-страницу
    }
}
