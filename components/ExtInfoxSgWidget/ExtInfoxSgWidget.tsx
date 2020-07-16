import * as React from 'react';
import { render } from 'react-dom';
import './ExtInfoxSgWidget.scss';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IState {
    htmlString: string;
}

interface IComponentProps {
    'data-script-id': string;
    'data-height': string;
    'data-width'?: string;
}

function inlineScript(document: Document, scriptId: string): void {
    if (typeof window !== 'undefined') {
        const n = `infoxContextAsyncCallbacks${scriptId}`;
        window[n] = window[n] || [];
        window[n].push(() => {
            window[`INFOX${scriptId}`].renderTo(`infox_${scriptId}`);
        });
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//rb.infox.sg/infox/${scriptId}?from=turbo`;
        script.async = true;
        document.head.appendChild(script);
    }
}

export class ExtInfoxSgWidget extends React.PureComponent<IComponentProps, IState> {
    public readonly state: IState = {
        htmlString: ''
    };

    public componentDidMount(): void {
        if (typeof window === 'undefined') {
            return;
        }
        this.composeHtmlString();
    }

    public render(): React.ReactNode {
        if (!this.state.htmlString) {
            return null;
        }
        return (
            <ExtEmbed
                html={this.state.htmlString || ''}
                iframeClass="ext-embed__ext-infoxsg-widget"
                iframeHeight={this.props['data-height']}
                iframeWidth={this.props['data-width']}
            />
        );
    }

    private composeHtmlString(): void {
        if (typeof window !== 'undefined') {
            const { 'data-script-id': scriptId } = this.props;

            const html = (
                <div>
                    <div id={`infox_${scriptId}`} />
                    {/* eslint-disable-next-line */}
                    <script dangerouslySetInnerHTML={{
                        __html: `(${inlineScript.toString()})(document,'${scriptId}')`
                    }}
                    />
                </div>
            );

            const tempDiv = document.createElement('div');
            render(html, tempDiv, () => {
                this.setState({ htmlString: tempDiv.innerHTML });
            });
        }
    }
}
