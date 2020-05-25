import * as React from 'react';
import { render } from 'react-dom';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    ['data-widget-id']: string;
    ['data-widget-src']?: string;
    ['data-model-id']?: string;
    ['data-render']?: string;
    ['data-search']?: string;
    ['data-sm-source']?: string;
    ['data-sm-source-target']?: string;
    ['data-category-ids']?: string;
    ['data-vendor-ids']?: string;
    ['data-matrix-cols']?: number;
    ['data-matrix-rows']?: number;
    ['data-matrix-dimension']?: string;

    /**
     * Ширина для тега iframe
     */
    iframeWidth?: string;

    /**
     * Высота для тега iframe
     */
    iframeHeight?: string;
}

export class ExtSocialMartWidget extends React.PureComponent<IProps> {
    public static defaultProps = {
        'data-render': 'js',
        'data-widget-src': '//widget.socialmart.ru/init.php'
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
                iframeHeight={this.props.iframeHeight}
                iframeWidth={this.props.iframeWidth}
            />
        );
    }

    private html(): JSX.Element {
        return (
            <>
                <div
                    className="smw3"
                    data-category-ids={this.props['data-category-ids']}
                    data-matrix-cols={this.props['data-matrix-cols']}
                    data-matrix-dimension={this.props['data-matrix-dimension']}
                    data-matrix-rows={this.props['data-matrix-rows']}
                    data-model-id={this.props['data-model-id']}
                    data-search={this.props['data-search']}
                    data-sm-source={this.props['data-sm-source']}
                    data-sm-source-target={this.props['data-sm-source-target']}
                    data-vendor-ids={this.props['data-vendor-ids']}
                    data-widget-id={this.props['data-widget-id']}
                />
                <noscript>
                    <a
                        href="//socialmart.ru"
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
        return `${this.props['data-widget-src']}?render=${this.props['data-render']}&wid=${this.props['data-widget-id']}`;
    }
}
