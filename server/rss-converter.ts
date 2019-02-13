import rp = require('request-promise');
import isEmpty = require('lodash/isEmpty');
import { URL } from 'url';

interface IErrorCode {
    severity?: string;
    code: string;
}

interface IRSSErrorWithMessage extends IErrorCode {
    details: {
        info: undefined;
        url: undefined;
    };

    message: string;
}

interface IRSSErrorWithDetails extends IErrorCode {
    message: undefined;
    details: {
        info?: string;
        url?: string;
    };
}

type IRssError = IRSSErrorWithMessage | IRSSErrorWithDetails;

const getParseErrorMessage = (e: IRssError) => {
    const message = e.message || e.details && (e.details.info || e.details.url);
    const title = (e.severity ? e.severity + ' ' : '') + e.code;

    return title + (message ? ': ' + message : '');
};

export const getErrorsMessage = (errors: IRssError[]) => errors.map(getParseErrorMessage).join('\n');

const BACKEND_TIMEOUT = 504;
const RANDOM_RADIX = 36;
const RANDOM_SLICE = 2;

export async function save(feedData: string, ttl: number = 600, host: string = 'http://turbo-test.yandex.ru') {
    // Если фид не начинается на '<rss' или '<?xml' -
    // считаем это контентом и заворачиваем в дефолтную обертку
    if (!feedData.startsWith('<rss') && !feedData.startsWith('<?xml')) {
        feedData = _wrapFeedContent(feedData, host);
    }

    const formData = {
        feed_data: feedData,
        params: JSON.stringify({ host }),
        content_ttl: ttl.toString()
    };

    const options = {
        method: 'POST',
        uri: 'https://turbo-rss-preview.common.yandex.net/preview',
        formData,
        rejectUnauthorized: false
    };

    const body = await rp(options)
        .catch((err: Error & {statusCode?: number}) => {
            // Если код ответа 504 Backend timeout - пробуем еще раз
            if (err && err.statusCode === BACKEND_TIMEOUT) {
                return rp(options);
            }
            throw err;
        })
        .catch((err: Error) => {
            err.message = `Не удалось сохранить rss в saas: ${err.message}`;
            throw err;
        });
    const result = JSON.parse(body);
    const savedDoc = !isEmpty(result.items) && result.items[0];
    let errorMessage;

    if (savedDoc) {
        if (savedDoc.preview) {
            return savedDoc.preview;
        } else if (!isEmpty(savedDoc.errors)) {
            errorMessage = getErrorsMessage(savedDoc.errors);
        }
    } else if (!isEmpty(result.errors)) {
        errorMessage = getErrorsMessage(result.errors);
    }
    throw new Error(`Ошибка парсинга rss:\n${errorMessage || 'не пришел результат'}`);
}

function _wrapFeedContent(feedContent: string, host: string) {
    const rnd = Math.random().toString(RANDOM_RADIX).slice(RANDOM_SLICE);
    const link = `${host}/${rnd}`;

    return `<?xml version="1.0" encoding="utf-8"?>
        <rss xmlns:yandex="http://news.yandex.ru"
            xmlns:media="http://search.yahoo.com/mrss/"
            xmlns:turbo="http://turbo.yandex.ru"
            version="2.0">
            <channel>
                <title>Турбо-страница</title>
                <item turbo="true">
                    <title>Turbo</title>
                    <link>${link}</link>
                    <turbo:content>
                        <![CDATA[${feedContent}]]>
                    </turbo:content>
                </item>
            </channel>
        </rss>`;
}

export const getHtml = async (xmlData: string) => {
    const uri = new URL(await save(xmlData));
    uri.hostname = 'turbo-pull-2414-rr-templates.hamster.yandex.ru';
    uri.protocol = 'http';
    uri.searchParams.set('text', 'bin:test-custom-components');
    uri.searchParams.set('custom-blocks-development', '1');
    return rp(uri.toString());
};
