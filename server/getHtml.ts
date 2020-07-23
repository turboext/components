import { createHash } from 'crypto';
import * as rp from 'request-promise';

// Save xml data not to make (new) requests
const savedXmls = {};

export const getHtml = (xmlData: string, options: rp.RequestPromiseOptions = {}): Promise<string> => {
    const hash = createHash('md5').update(xmlData)
        .digest('hex');
    if (savedXmls[hash]) {
        return Promise.resolve(savedXmls[hash]);
    }

    // @ts-ignore broken typings
    return rp({
        uri: 'https://turbo-components.yandex.net',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            ...options.headers || {}
        },
        body: JSON.stringify({ xml: xmlData })
    })
        .then(html => {
            savedXmls[hash] = html;
            return html;
        });
};
