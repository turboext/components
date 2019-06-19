import * as React from 'react';
import './ExtProductBlock.scss';

interface IProductBlockProps {
    'data-name': string;
    'data-description'?: string;
    'data-image-url': string;
    'data-image-alt'?: string;
    'data-product-url': string;
    'data-price': string;
    'data-currency'?: string;
    'data-button-text'?: string;
    'data-button-color'?: string;
}

export function ExtProductBlock(props: IProductBlockProps): React.ReactNode {
    let currencyClass = 'product-block__price product-block__price--';

    if (Object.prototype.hasOwnProperty.call(props, 'data-currency')) {
        currencyClass += props['data-currency'];
    } else {
        currencyClass += 'rub';
    }

    return (
        <div className="product-block__item">
            <div className="product-block__image">
                <a
                    href={props['data-product-url']}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <img
                        alt={props['data-image-alt']}
                        className="image-item"
                        src={props['data-image-url']}
                        title={props['data-image-alt']}
                    />
                </a>
            </div>
            <div className="product-block__title">
                <a
                    href={props['data-product-url']}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {props['data-name']}
                </a>
            </div>
            <div className={currencyClass}>{props['data-price']}</div>
            <div className="product-block__description"><p>{props['data-description']}</p></div>
            <a
                className="product-block__button product-block__button--fancy_button"
                href={props['data-product-url']}
                rel="noopener noreferrer"
                style={{
                    backgroundColor: props['data-button-color'],
                    color: props['data-button-text-color']
                }}
                target="_blank"
            >
                {props['data-button-text'] ? props['data-button-text'] : 'Купить'}
            </a>
        </div>
    );
}
