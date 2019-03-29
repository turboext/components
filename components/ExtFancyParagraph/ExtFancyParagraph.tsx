import * as React from 'react';
import './ExtFancyParagraph.scss';

interface IFancyParagraphProps {
    children: React.ReactChildren;
    'data-title': string;
}

interface IFancyParagraphState {
    isLeft: boolean;
}

export class ExtFancyParagraph extends React.Component<IFancyParagraphProps, IFancyParagraphState> {
    public state = {
        isLeft: true
    }

    public render(): React.ReactNode {
        const { children } = this.props;

        // Первым элементом ожидаем exchangeRates
        const marquee = React.cloneElement(children[0], {
            direction: this.state.isLeft ? 'left' : 'right'
        });

        // Все что будет дальше считаем просто текстом
        const text = React.Children.toArray(children).slice(1);

        return (
            <div className="fancy-paragraph" onClick={this.handleClick}>
                <div className="fancy-paragraph__label"> {this.props['data-title']} </div>
                {

                    /*
                     * Несмотря на то, что мы пробрасываем направление,
                     * сам элемент изменит его только спустя какое-то время
                     */
                }
                <div className="fancy-paragraph__text-container">
                    {marquee}
                </div>
                <div className="fancy-paragraph__text">
                    {text}
                </div>
            </div>
        );
    }

    public handleClick = () => {
        const { isLeft } = this.state;
        this.setState({
            isLeft: !isLeft
        });
    }
}
