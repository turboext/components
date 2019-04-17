import * as React from 'react';

import './ExtCountDown.scss';

interface IProps {
    'data-date': string;
    'data-text': string;
}

interface IState {
    count: number;
}

export class ExtCountDown extends React.PureComponent<IProps, IState> {
    public state = {
        count: 0
    }

    public componentDidMount(): void {
        setInterval(this.changeCount, 1000);
    }

    public render(): JSX.Element {
        const text = this.props['data-text'];

        return (
            <div className='count-down'>
                <span className='count-down__text'>{text}</span>
                <span className='count-down__time'>{this.state.count}</span>
            </div>
        );
    }

    private changeCount = () => {
        const date = new Date(this.props['data-date']);
        const startDate = new Date();
        const currentCount = (date.getTime() - startDate.getTime()) / 1000;

        this.setState({
            count: currentCount
        });
    }
}
