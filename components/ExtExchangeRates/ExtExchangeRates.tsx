import * as React from 'react';
import { getYesterday, formatDate } from './utils/date';
import { selectRates, diffRates, IRate } from './utils/rates';

import './ExtExchangeRates.scss';

interface IProps {
    'data-rates': [];
}

export class ExtExchangeRates extends React.PureComponent<IProps> {
    public state = {
        status: 'loading',
        rates: {}
    }

    public componentDidMount(): void {
        const yesterday: Date = getYesterday();

        Promise.all([
            fetch('https://api.exchangeratesapi.io/latest?base=RUB'),
            fetch(`https://api.exchangeratesapi.io/${formatDate(yesterday)}?base=RUB`)
        ]).then(([
            resToday,
            resYesterday
        ]) => Promise.all([
            resToday.json(),
            resYesterday.json()
        ]))
            .then(([
                resToday,
                resYesterday
            ]) => {
                const ratesToday = selectRates(this.props['data-rates'], resToday);
                const ratesYesterday = selectRates(this.props['data-rates'], resYesterday);

                this.setState({
                    status: 'loaded',
                    rates: diffRates(ratesToday, ratesYesterday)
                });
            });
    }

    public render(): JSX.Element {
        const isLoading = this.state.status === 'loading';

        return (
            <div className="ext-exchange-rates">
                {isLoading ? <span className="ext-exchange-rates__loading">Загрузка...</span> : null}
                {isLoading ? null : this.renderRates()}
                {isLoading ? null :
                    <div className="ext-exchange-rates__description">
                        Курсы валют на {formatDate(new Date())} <br />
                        по данным exchangeratesapi.io
                    </div>
                }
            </div>
        );
    }

    private renderRates(): JSX.Element {
        const { rates } = this.state;

        const currencyRender = Object.keys(rates).map(currency => this.renderCurrency(currency, rates[currency]));

        return (
            <div className="ext-exchange-rates__wrapper">
                {/* Workaround для marquee, так как он не поддержан в typings для react */}
                {React.createElement('marquee', { scrolldelay: 1 }, currencyRender)}
            </div>
        );
    }

    private renderCurrency(currency: string, rate: IRate): JSX.Element {
        const color = rate.sign >= 0 ? 'green' : 'red';

        return (
            <span
                className="ext-exchange-rates__rate"
                key={currency}
            >
                {currency}&nbsp;
                <span
                    className={`ext-exchange-rates__value_${color}`}
                >
                    {rate.value.toFixed(2)}
                </span>
            </span>
        );
    }
}
