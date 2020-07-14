import * as React from 'react';
import { render } from 'react-dom';
import './ExtInfoxSgWidget.scss';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IState {
    htmlString: string;
    loadingState: LoadingState;
    height: number;
    width?: number;
}

const DEFAULT_HEIGHT = 400;

enum LoadingState {
    inProgress = 'inProgress',
    succeed = 'succeed',
    failed = 'failed',
}

enum MessageType {
    loadingSucceed = 'loading-succeed',
    loadingFailed = 'loading-failed',
}

interface IMessageData {
    type: string;
    height?: number;
    width?: number;
}

type ComponentProps = {
    'data-script-id': string;
    'data-height': number;
    'data-width'?: number;
} & Record<string, string | number | boolean>;

function inlineScript(document: Document, scriptId: string): void {
    if (typeof window !== 'undefined') {
		var n = "infoxContextAsyncCallbacks" + scriptId;
        window[n] = window[n] || [];
        window[n].push(function() {
            window['INFOX' + scriptId].renderTo("infox_" + scriptId);
        });
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//rb.infox.sg/infox/" + scriptId;
        script.async = true;
		document.head.appendChild(script);
    }
}

export class ExtInfoxSgWidget extends React.PureComponent<ComponentProps, IState> {
    public readonly state: IState = {
        htmlString: '',
        loadingState: LoadingState.inProgress,
        height: DEFAULT_HEIGHT
    };

    public componentDidMount(): void {
        if (typeof window === 'undefined') {
            return;
        }
        this.initDimensions();
        this.composeHtmlString();
    }

    public render(): React.ReactNode {
        const { width, height, htmlString, loadingState } = this.state;

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

    private initDimensions(): void {
        const { 'data-width': width, 'data-height': height } = this.props;
        this.setState({
            height: height || DEFAULT_HEIGHT,
            width
        });
    }

}