import * as React from 'react';

import './ExtBusinessCard.scss';

interface IProps {
    'data-name': string;
    'data-position': string;
    'data-email': string;
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
    email: string;
    city?: string;
    countryName?: string;
    postalCode?: string;
    address?: string;
    phone?: string;
    phoneExt?: string;
}

export class ExtBusinessCard extends React.PureComponent<IProps, IState> {
    public static getDerivedStateFromProps(props: IProps): IState {
        return {
            position: props['data-position'],
            name: props['data-name'],
            email: props['data-email'],
            city: props['data-city'],
            countryName: props['data-country-name'],
            postalCode: props['data-postal-code'],
            address: props['data-address'],
            phone: props['data-phone'],
            phoneExt: props['data-phone-ext']
        };
    }

    public renderAddress(): JSX.Element {
        const { city, postalCode, countryName, address } = this.state;

        const parts = [
            city &&
                (<span className="ext-business-card__city" itemProp="locality">{city}</span>),
            postalCode &&
                (<span className="ext-business-card__zip" itemProp="postal-code">{postalCode}</span>),
            countryName &&
                (<span className="ext-business-card__country" itemProp="country-name">{countryName}</span>),
            address &&
                (<span className="ext-business-card__street-address" itemProp="street-address">{address}</span>)
        ].filter(Boolean);

        if (!parts.length) {
            return <></>;
        }

        return (
            <div
                className="ext-business-card__address"
                itemProp="address"
                itemScope
                itemType="http://data-vocabulary.org/Address"
            >
                {
                    parts.map((part, i) => [
                        <>{part}</>,
                        i === parts.length - 1 ? '' : ', '
                    ])
                }
            </div>
        );
    }

    public renderContacts(): JSX.Element {
        const { phone, phoneExt, email } = this.state;

        const parts = [
            phone && (
                <div className="ext-business-card__tel">тел.:&nbsp;
                    <a className="ext-business-card__phone-link">{phone}</a>
                    {phoneExt ? `, доб. ${phoneExt}` : null}
                </div>
            ),

            email && (
                <div className="ext-business-card__email">
                    <a className="ext-business-card__link" href={`mailto:${email}`}>{email}</a>
                </div>)
        ].filter(Boolean);

        if (!parts.length) {
            return <></>;
        }

        return (
            <div className="ext-business-card__contact">
                {parts}
            </div>
        );
    }

    public render(): JSX.Element {
        const { name, position } = this.state;

        return (
            <div
                className="ext-business-card"
                data-lang="ru"
                itemScope
                itemType="http://data-vocabulary.org/Person"
            >
                <div className="ext-business-card__title">
                    <h1 className="ext-business-card__name" itemProp="name">{name}</h1>
                    <h2 className="ext-business-card__position" itemProp="title">{position}</h2>
                </div>
                { this.renderAddress() }
                { this.renderContacts() }
            </div>
        );
    }
}
