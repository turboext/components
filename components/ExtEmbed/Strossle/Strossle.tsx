import * as React from 'react';

export class Strossle extends React.PureComponent<{}> {
    public componentDidMount() {
        this.mb = new MessageBrocker(this.props.id);

        this.md.listen('resize', () => {});

        this.md.send('resize', { width, height });
    }

    public componentWillUnmount() {
        this.md.unlisten('resize');
    }

    public render(): React.ReactNode {
        return (
            <div
                data-spklw-widget={this.props['data-widget']}
            >
                <script async src="https://widgets.sprinklecontent.com/v2/sprinkle.js"></script>
            </div>
        );
    }
}
