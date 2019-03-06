import cheerio = require('cheerio');

const customComponentStylesheet = '<link rel="stylesheet" href="/dist/index.css">';
const customComponentScript = '<script src="/dist/index.js"></script>';

const preparePage = (rawHtml: string): string => {
    const $ = cheerio.load(rawHtml);

    /* Вырезаем всех детей у hydro чтобы спокойно зарендерить компоненты с нуля */
    $('.hydro')
        .toArray()
        .map(component => component.children = []);

    /* Добавляем стили и скрипты всех кастомных компонетов (загружаются синхронно) */
    $('.page').append(`${customComponentStylesheet}\n${customComponentScript}`);

    /* Заменяем минифицированную версию реакта на полную (для красивого логирования ошибок) */
    const reactScript = $('script[src$="react-with-dom.min.js"]');
    const reactUrl = reactScript.attr('src').replace('.min', '');
    reactScript.attr('src', reactUrl);

    return $.html();
};

export default preparePage;
