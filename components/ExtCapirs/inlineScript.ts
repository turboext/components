import { IWidgetParams } from './commonInterfaces';

interface IBanner {
    width: string;
    height: string;
}

interface IFeed {
    banners: { graph: { width: string; height: string }[] };
}

export const GLOBAL_CALLBACKS_PROPERTY = 'begun_callbacks';

export function inlineScript(
    window: Window,
    document: Document,
    globalCallbackProperty: string,
    params: IWidgetParams
): void {
    window.addEventListener(
        'message',
        event => {
            if (!event.data || event.data.message !== 'save-location') {
                return;
            }

            window.context = window.context || {};
            window.context.location = window.context.location || {};

            // Save href and referrer in AMP-like fashion
            // They will be used inside of capirs automatically
            window.context.location.href = window.context.location.href || event.data.href;
            window.context.referrer = window.context.referrer || event.data.referrer;
        },
        false
    );

    // Request href and referrer from the top window
    window.parent.postMessage({ message: 'get-location' }, '*');

    function isResponsiveAd(dimension: string): boolean {
        return dimension.indexOf('%') !== -1;
    }

    /* eslint-disable-next-line */
    function getWidth(banner: IBanner): number | void {
        /**
         * Если с сервера пришёл "резиновый" баннер, то задаём ширину 100% через
         * класс "ext-embed__ext-capirs_fill".
         */
        if (!isResponsiveAd(banner.width)) {
            /**
             * Если же пришёл баннер с фиксированной шириной, передаём её из iframe
             * наверх.
             */
            return parseInt(banner.width, 10);
        }
    }

    window[globalCallbackProperty] = {
        lib: {
            init: () => {
                const block = document.body.querySelector<HTMLDivElement>('.capirs-container');

                window.Adf.banner.ssp(block, params.json, {
                    'begun-auto-pad': params.begunAutoPad,
                    'begun-block-id': params.begunBlockId
                });
            }
        },
        block: {
            draw: (feed: IFeed) => {
                const banner = feed.banners.graph[0];

                window.parent.postMessage(
                    {
                        message: 'loading-succeed',
                        width: getWidth(banner),
                        // iframe height should be in pixels without "px" at the end
                        height: parseInt(banner.height, 10)
                    },
                    '*'
                );
            },
            unexist: () => {
                window.parent.postMessage({ message: 'loading-failed' }, '*');
            }
        }
    };
}
