import { NextFunction, Request, Response, Router } from 'express';
import { resolve } from 'path';
import { readFile } from 'fs-extra';
import { getHtml } from '../rss-converter';

import preparePage from '../utils/preparePage';
import handleErr from '../utils/handleError';

import pascalCase = require('pascal-case');

const router = Router();

router.get('/render/:componentName/:componentExample', async (req: Request, res: Response, next: NextFunction) => {
    const CODE_SUCCESS = 200;

    /*
     * Компонент в исходном коде хранится в PascalCase, когда в xml приходит в kebab-case.
     * В урле сохраняем второй вариант, так как урл может быть регистронезависимым
     */
    const componentName = pascalCase(req.params.componentName);

    /* Не указываем `xml` в урле, т.к. это не несет смысловой нагрузки. Добавляем для нахожления файла. */
    const exampleName = `${req.params.componentExample}.xml`;

    const examplePath = resolve('components', componentName, `${componentName}.examples`, exampleName);

    let xml;
    let data;

    try {
        xml = await readFile(examplePath, 'utf8');
        data = preparePage(await getHtml(xml));
    } catch (e) {
        return next(handleErr(e, examplePath));
    }

    res.writeHead(CODE_SUCCESS, {
        'content-type': 'text/html; charset=utf-8',
        'i-requested-component': componentName,
        'i-requested-example': exampleName,
        'i-raw-xml-data': JSON.stringify(xml.replace(/\s+/g, ' '))
    });

    res.end(data);
});

export default router;
