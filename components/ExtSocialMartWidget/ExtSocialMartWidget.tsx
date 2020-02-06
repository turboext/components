import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    widgetId: string;
    widgetSrc?: string;
    modelId?: string;
    render?: string;
    search?: string;
    smSource?: string;
    smSourceTarget?: string;
    categoryIds?: string;
    vendorIds?: string;
    matrixCols?: number;
    matrixRows?: number;
    matrixDimension?: string;
}

export class ExtSocialMartWidget extends React.PureComponent<IProps> {
    public static defaultProps = {
        render: 'js',
        widgetSrc: 'http://widget.socialmart.ru/init.php'
    };

    public readonly state = { htmlString: null };

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            const tempDiv = document.createElement('div');
            render(this.html(), tempDiv, () => {
                this.setState({ htmlString: tempDiv.innerHTML });
            });
        }
    }

    public render(): React.ReactNode {
        if (!this.state.htmlString) {
            return null;
        }

        return (
            <ExtEmbed
                html={this.state.htmlString || ''}
                iframeClass="ext-embed__ext-socialmart-widget"
            />
        );
    }

    private html(): JSX.Element {
        const {
            categoryIds,
            matrixCols,
            matrixDimension,
            matrixRows,
            modelId,
            search,
            smSource,
            smSourceTarget,
            vendorIds,
            widgetId,
            ...rest
        } = this.props;

        return (
            <>
                <div
                    className="smw3"
                    data-category-ids={categoryIds}
                    data-matrix-cols={matrixCols}
                    data-matrix-dimension={matrixDimension}
                    data-matrix-rows={matrixRows}
                    data-model-id={modelId}
                    data-search={search}
                    data-sm-source={smSource}
                    data-sm-source-target={smSourceTarget}
                    data-vendor-ids={vendorIds}
                    data-widget-id={widgetId}
                    {...rest}
                />
                <noscript>
                    <a
                        href="http://socialmart.ru"
                        rel="noopener noreferrer"
                        target="_blank"
                        title="SocialMart"
                    >
                        Виджет от SocialMart
                    </a>
                </noscript>
                <script
                    async
                    charSet="UTF-8"
                    src={this.fullSrc}
                    type="text/javascript"
                />
            </>
        );
    }

    private get fullSrc(): string {
        return `${this.props.widgetSrc}?render=${this.props.render}&wid=${this.props.widgetId}`;
    }
}
