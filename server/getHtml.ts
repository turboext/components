import rp = require('request-promise');

// @ts-ignore broken typings
export const getHtml = (xmlData: string): Promise<string> => rp({
    uri: 'http://localhost:8080/',
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({ xml: xmlData })
});
