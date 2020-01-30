export enum MessageType {
    loadingSucceed = 'loading-succeed',
    loadingFailed = 'loading-failed',
    getLocation = 'get-location',
    saveLocation = 'save-location',
}

export interface IWidgetParams {
    begunAutoPad: number;
    begunBlockId: number;
    json?: Record<string, string | number>;
}

declare global {
    // Расширяем существующий интерфейс Window, поэтому он не может начинаться с I - отключаем eslint
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Window {
    // AMP-like объект, содержащий location страницы, в которую встроен iframe
        context?: {
            referrer?: string;
            location?: {
                href?: string;
            };
        };

        Adf: {
            banner: {
                ssp: (
                    adWrapperID: HTMLElement | null,
                    sspOptions: Record<string, string | number> | undefined,
                    commonOptions: {
                        'begun-auto-pad': number;
                        'begun-block-id': number;
                    }
                ) => Promise<object>;
            };
        };
    }
}
