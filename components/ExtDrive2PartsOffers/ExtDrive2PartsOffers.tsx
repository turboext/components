import * as React from 'react';
import './ExtDrive2PartsOffers.scss';

interface IProps {
    children: React.ReactChildren;
    'data-source': string;
}

interface IOfferSource {
    marketplace: string;
    link: string;
    caption: string;
    price?: string;
}

interface IOffer {
    marketplace: IMarketplace;
    link: string;
    caption: string;
    price?: string;
}

interface IMarketplace {
    caption: string;
    logo: string;
}

interface IState {
    offers: IOffer[];
    isClosed: boolean;
}

export class ExtDrive2PartsOffers extends React.Component<IProps, IState> {
    public static CLOSED_OFFERS_SIZE = 6;

    public state = {
        offers: [],
        isClosed: true
    }

    private static renderOffer(offer: IOffer, key: number): React.ReactNode {
        return (
            <tr className="d2-offers__item" key={key}>
                <td className="d2-offers__caption-col">
                    <a className="d2-offers__caption" href={offer.link}>{offer.caption}</a>
                </td>
                <td className="d2-offers__marketplace-col">
                    <a
                        className="d2-offers__marketplace"
                        href={offer.link}
                        style={{ backgroundImage: `url(${offer.marketplace.logo})` }}
                    >
                        {offer.marketplace.caption}
                    </a>
                </td>
                <td className="d2-offers__price-col">
                    {offer.price ?
                        <a className="d2-offers__price" href={offer.link}><span className="d2-offers__badge">{offer.price}</span></a> :
                        null
                    }
                </td>
            </tr>
        );
    }

    public componentDidMount(): void {
        const source = this.props['data-source'];
        if (typeof window !== 'undefined') {
            fetch(source)
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        offers: data.items.map((offer: IOfferSource) => ({
                            ...offer,
                            marketplace: data.marketplaces[offer.marketplace]
                        })),
                        isClosed: data.items.length > ExtDrive2PartsOffers.CLOSED_OFFERS_SIZE
                    });
                })
                .catch(() => {}); // eslint-disable-line no-empty-function
        }
    }

    public render(): React.ReactNode {
        const { offers, isClosed } = this.state;
        const size = isClosed ? 6 : offers.length;

        if (offers.length === 0) {
            return null;
        }

        return (
            <>
                {this.props.children}
                <div className={`d2-offers ${isClosed ? ' d2-offers--closed' : ''}`}>
                    <table className="d2-offers__list">
                        <tbody>
                            {offers.slice(0, size).map(ExtDrive2PartsOffers.renderOffer)}
                        </tbody>
                    </table>
                </div>
                {isClosed ?
                    <button
                        className="turbo-button turbo-button_theme_gray turbo-button_width_max turbo-button_size_m"
                        onClick={this.handleClick} type="button"
                    >
                        Показать ещё
                    </button> :
                    null
                }
            </>
        );
    }

    public handleClick = () => {
        this.setState({
            isClosed: false
        });
    }
}
