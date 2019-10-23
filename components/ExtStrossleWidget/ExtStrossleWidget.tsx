import * as React from 'react';

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
    }
}
