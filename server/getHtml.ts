import rp = require('request-promise');

export const getHtml = async (xmlData: string) => {
    return rp({
        uri: 'http://localhost:8080/',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ xml: xmlData })
    });
};
