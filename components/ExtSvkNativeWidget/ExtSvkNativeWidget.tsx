import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-w': number;
    'data-sid': number;
    'data-width'?: string;
    'data-height'?: string;
}

const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = '200';

interface IState {
    htmlString: string;
    height: string;
    width?: string;
}

export class ExtSvkNativeWidget extends React.PureComponent<IProps, IState> {
    public readonly state: IState = {
        htmlString: '',
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    };

    private constructor(props: IProps) {
        super(props);
        this.handlePostMessage = this.handlePostMessage.bind(this);
    }

    public componentDidMount(): void {
        this.initDimensions();
        this.setHtmlString();
    }

    public render(): React.ReactNode {
        const { htmlString, width, height } = this.state;

        return (
            <ExtEmbed
                html={htmlString}
                iframeClass="ext-embed__ext-svk-native-widget"
                iframeHeight={height}
                iframeWidth={width}
                onMessage={this.handlePostMessage}
            />
        );
    }

    private setHtmlString(): void {
        const { 'data-w': w, 'data-sid': sid } = this.props;
        this.setState({ htmlString:
                `<script type="text/javascript" data-key="script_key_value">
                (function(w, a) {
                    (w[a] = w[a] || []).push({
                        'script_key': 'script_key_value',
                        'settings': {
                            'w': ${w},
                            'sid': ${sid}
                        }
                    });
                    if(!window['_SVKNative_embed']) {
                        var node = document.createElement('script'); node.type = 'text/javascript'; node.async = true;
                        node.src = 'https://widget.svk-native.ru/js/embed.js';
                        (
                            document.getElementsByTagName('head')[0] ||
                            document.getElementsByTagName('body')[0]
                        ).appendChild(node);
                    } else {
                        window['_SVKNative_embed'].initWidgets();
                    }
                    window.addEventListener("message", function(event){
                        window.parent.postMessage(event.data, '*');
                    }, false);
                })(window, '_svk_n_widgets');
            </script>` });
    }

    private initDimensions(): void {
        const { 'data-width': width, 'data-height': height } = this.props;
        this.setState({
            width: width || DEFAULT_WIDTH,
            height: height || DEFAULT_HEIGHT
        });
    }

    private handlePostMessage(event: MessageEvent): void {
        const message = event.data;

        if (message.type) {
            if (message.type === 'svk-resize') {
                if (message.data !== this.state.height) {
                    this.setState({ height: message.data });
                }
            }
        }
    }
}
