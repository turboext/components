import rp = require('request-promise');

// @ts-ignore broken typings
export const getHtml = (xmlData: string): Promise<string> => rp({
    uri: 'turbo-components.yandex.net',
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({ xml: xmlData })
});
