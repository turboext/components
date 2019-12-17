import cheerio = require('cheerio');

const customComponentStylesheet = '<link rel="stylesheet" href="/dist/index.css">';
// Выставлен defer, чтобы бандл с локальными компонентами загрузился после вшитого в html
const customComponentScript = '<script src="/dist/index.js" defer></script>';

const preparePage = (rawHtml: string): string => {
    /*
     * Так как вся страница подготавливается на сервере, и скрипты уже опубликованных кастомных компонентов туда тоже вшиты,
     * Появляется проблема, что компоненты, которые приходят с сервера, регистрируются после тех, которые собираются при локальной разработке
     * То есть текущие изменения не получается увидеть. Поэтому здесь убрана инициализация компонентов, и перенесена в /tools/build-registry
     * Она произойдет после того, когда загрузится локальный бандл с компонентами
     */
    const html = rawHtml.replace('window.Ya.initReact();', '');
    const $ = cheerio.load(html);

    /* Вырезаем всех детей у hydro чтобы спокойно зарендерить компоненты с нуля */
    $('.hydro')
        .toArray()
        .map(component => component.children = []);

    /* Добавляем стили и скрипты всех кастомных компонетов */
    $('.page').append(`${customComponentStylesheet}\n${customComponentScript}`);

    /* Заменяем минифицированную версию реакта на полную (для красивого логирования ошибок) */
    const reactScript = $('script[src$="react-with-dom.min.js"]');
    const reactUrl = reactScript.attr('src').replace('.min', '');
    reactScript.attr('src', reactUrl);

    return $.html();
};

export default preparePage;
