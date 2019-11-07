import * as React from 'react';

export class Strossle extends React.PureComponent<{}> {
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
