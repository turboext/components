import * as React from 'react';
import { formatDate } from './utils/date';

import './ExtExchangeRates.scss';

interface IProps {
    'data-before': Record<string, number>;
    'data-today': Record<string, number>;
    'data-date': number;
    'data-supply': string;
    direction?: 'left' | 'right';
}

interface IRate {
    name: string;
    value: number;
    sign: number;
}

interface IState {
    rates: IRate[];
}

export class ExtExchangeRates extends React.PureComponent<IProps, IState> {
    public state = {
        rates: []
    };

    public static getDerivedStateFromProps(props: IProps): IState {
        const keys = Object.keys(props['data-today']);

        const rates: IRate[] = keys.map((key: string) => ({
            name: key,
            value: 1 / props['data-today'][key],
            sign: Math.sign(props['data-today'][key] - props['data-before'][key])
        }));

        return { rates };
    }

    public render(): JSX.Element {
        return (
            <div className="ext-exchange-rates">
                { this.renderRates() }
                <div className="ext-exchange-rates__description">
                    Курсы валют на {formatDate(new Date())} <br />
                    по данным {this.props['data-supply']}
                </div>
            </div>
        );
    }

    private renderRates(): JSX.Element {
        const { direction = 'left' } = this.props;

        return (
            <div className="ext-exchange-rates__wrapper">
                {/* Workaround для marquee, так как он не поддержан в typings для react */}
                {React.createElement('marquee', { scrolldelay: 1, direction }, this.state.rates.map(this.renderCurrency))}
            </div>
        );
    }

    private renderCurrency(rate: IRate): JSX.Element {
        const color = rate.sign >= 0 ? 'green' : 'red';

        return (
            <span
                className="ext-exchange-rates__rate"
                key={rate.name}
            >
                {rate.name}&nbsp;
                <span
                    className={`ext-exchange-rates__value_${color}`}
                >
                    {rate.value.toFixed(2)}
                </span>
            </span>
        );
    }
}
