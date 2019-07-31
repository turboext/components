import * as React from 'react';

import { getOffsetFrom } from './utils/date';
import { ExtExchangeRates } from '../ExtExchangeRates/ExtExchangeRates';
import { formatDate } from '../ExtExchangeRates/utils/date';

interface IState {
    rates: Record<string, Record<string, number>>;
}

interface IProps {
    'data-source': string;
    'data-currency': string;
    'data-supply': string;
    'data-date': number;
}

export class ExtDynamicExchangeRates extends React.Component<IProps, IState> {
    public state = {
        rates: {
            previous: {},
            latest: {}
        }
    }

    public componentDidMount(): void {
        this.getRates();
    }

    public render(): React.ReactNode {
        return (
            <ExtExchangeRates
                data-before={this.state.rates.previous}
                data-date={this.props['data-date']}
                data-supply={this.props['data-supply']}
                data-today={this.state.rates.latest}
            />
        );
    }

    private getPeriod(): Date[] {
        const endDate = new Date(this.props['data-date']);

        return [
            getOffsetFrom(endDate, 1),
            endDate
        ];
    }

    private getRates(): void {
        const [
            startDate,
            endDate
        ] = this.getPeriod().map(formatDate);
        const source = this.props['data-source'];
        const currency = this.props['data-currency'];

        if (typeof window !== 'undefined') {
            fetch(`${source}/exchange/history?start_at=${startDate}&end_at=${endDate}&base=${currency}`)
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }

                    return response.json();
                })
                .then(({ rates }) => this.setState({ rates: { latest: rates[startDate], previous: rates[endDate] } }));
        }
    }
}
