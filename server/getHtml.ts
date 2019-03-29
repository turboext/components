import rp = require('request-promise');
import { createHash } from 'crypto';

// Save xml data not to make (new) requests
const savedXmls = {};

export const getHtml = (xmlData: string): Promise<string> => {
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
            'content-type': 'application/json'
        },
        body: JSON.stringify({ xml: xmlData })
    })
        .then(html => {
            savedXmls[hash] = html;
            return html;
        });
};
