import * as React from 'react';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IProps {
    'data-w': number;
    'data-sid': number;
    'data-width'?: string;
    'data-height'?: string;
}

function handlePostMessage(event: MessageEvent): void {
    const message = event.data;

    if (message.type && message.type === 'svk-resize' && typeof window !== 'undefined') {
        const iframe = document.querySelector<HTMLElement>('.ext-embed__ext-svk-native-widget');

        // @ts-ignore
        if (message.data !== iframe.height) {
            // @ts-ignore
            iframe.height = message.data;
        }
    }
}

export function ExtSvkNativeWidget(props: IProps): React.ReactNode {
    const {
        'data-w': w,
        'data-sid': sid,
        'data-width': width = '100%',
        'data-height': height = '200'
    } = props;

    const html = `
        <script type="text/javascript" data-key="script_key_value">
            (function(w, a) {
                (w[a] = w[a] || []).push({
                    'script_key': 'script_key_value',
                    'settings': {
                        'w': ${w},
                        'sid': ${sid}
                    }
                });
                if(!window['_SVKNative_embed']) {
                    let node = document.createElement('script'); node.type = 'text/javascript'; node.async = true;
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
        </script>
    `;

    return (
        <ExtEmbed
            html={html}
            iframeClass="ext-embed__ext-svk-native-widget"
            iframeHeight={height}
            iframeWidth={width}
            onMessage={handlePostMessage}
        />
    );
}
