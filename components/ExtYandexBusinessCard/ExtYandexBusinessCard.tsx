import * as React from 'react';

import './ExtYandexBusinessCard.scss';

interface IProps {
    'data-name': string;
    'data-position': string;
    'data-city': string;
    'data-country-name': string;
    'data-postal-code': string;
    'data-address': string;
    'data-phone': string;
    'data-phone-ext': string;
}

interface IState {
    position: string;
    name: string;
    city: string;
    countryName: string;
    postalCode: string;
    address: string;
    phone: string;
    phoneExt: string;
    email: string;
}

export class ExtYandexBusinessCard extends React.PureComponent<IProps, IState> {
    public static getDerivedStateFromProps(props: IProps): IState {
        return {
            position: props['data-position'],
            name: props['data-name'],
            city: props['data-city'],
            countryName: props['data-country-name'],
            postalCode: props['data-postal-code'],
            address: props['data-address'],
            phone: props['data-phone'],
            phoneExt: props['data-phone-ext'],
            email: props['data-email']
        };
    }

    public render(): JSX.Element {
        return (
            <div
                className="ext-yandex-business-card"
                data-lang="ru"
                itemScope
                itemType="http://data-vocabulary.org/Person"
            >
                <div className="ext-yandex-business-card__title">
                    <h1 className="ext-yandex-business-card__name" itemProp="name">{this.state.name}</h1>
                    <h2 className="ext-yandex-business-card__position" itemProp="title">{this.state.position}</h2>
                </div>
                <div
                    className="ext-yandex-business-card__address"
                    itemProp="address"
                    itemScope
                    itemType="http://data-vocabulary.org/Address"
                >
                    <span
                        className="ext-yandex-business-card__city"
                        itemProp="locality"
                    >
                        {this.state.city}
                    </span>,
                    <span
                        className="ext-yandex-business-card__zip"
                        itemProp="postal-code"
                    >
                        {this.state.postalCode}
                    </span>,
                    <span
                        className="ext-yandex-business-card__country"
                        itemProp="country-name"
                    >
                        {this.state.countryName}
                    </span>,
                    <span
                        className="ext-yandex-business-card__street-address"
                        itemProp="street-address"
                    >
                        {this.state.address}
                    </span>
                </div>
                <div
                    className="ext-yandex-business-card__contact"
                >
                    <div className="ext-yandex-business-card__tel ext-yandex-business-card__tel_type_work">
                        тел.:
                        <a className="ext-yandex-business-card__phone-link">
                            {this.state.phone}
                        </a>,
                        доб. ${this.state.phoneExt}
                    </div>
                </div>
            </div>
        );
    }
}
