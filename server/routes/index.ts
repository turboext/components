import { resolve } from 'path';
import { NextFunction, Request, Response, Router as routerFactory } from 'express';
import { readFile, readdir } from 'fs-extra';
import { getHtml } from '../getHtml';

import preparePage from '../utils/preparePage';
import handleErr from '../utils/handleError';
import removeCSP from '../utils/removeCSP';

import pascalCase = require('pascal-case');

const router = routerFactory();

const CODE_SUCCESS = 200;

router.get('/render/:componentName/:componentExample', async(req: Request, res: Response, next: NextFunction) => {
    /*
     * Компонент в исходном коде хранится в PascalCase, когда в xml приходит в kebab-case.
     * В урле сохраняем второй вариант, так как урл может быть регистронезависимым
     */
    const componentName = pascalCase(req.params.componentName);

    /* Не указываем xml в урле, т.к. это не несет смысловой нагрузки. Добавляем для нахожления файла. */
    const exampleName = `${req.params.componentExample}.xml`;

    const examplePath = resolve('components', componentName, `${componentName}.examples`, exampleName);

    let xml = '';
    let data = '';

    try {
        xml = await readFile(examplePath, 'utf8');
        data = removeCSP(preparePage(await getHtml(xml, {
            headers: {
                'User-Agent': req.get('User-Agent')
            }
        })));
    } catch (e) {
        next(handleErr(e, examplePath));
        return;
    }

    res.writeHead(CODE_SUCCESS, {
        'content-type': 'text/html; charset=utf-8',
        'i-requested-component': componentName,
        'i-requested-example': exampleName
    });

    res.end(data);
});

router.get('/', async(req: Request, res: Response) => {
    const components = await readdir(resolve('components'));
    const examplesPromises = components.map(async componentName => {
        let examples: string[] = [];
        try {
            examples = await readdir(resolve('components', componentName, `${componentName}.examples`));
        } catch (e) {
            examples = [];
        }

        return examples.map(examplePath => {
            const exampleName = examplePath.replace('.xml', '');
            const link = `/render/${componentName}/${exampleName}`;

            return `<a href="${link}"> ${componentName} => ${exampleName} </a>`;
        });
    });

    const examples = (await Promise.all(examplesPromises))
        .reduce((acc: string[], examplesArray: string[]) => acc.concat(examplesArray), [])
        .join('<br>');

    res.writeHead(CODE_SUCCESS, {
        'content-type': 'text/html; charset=utf-8'
    });

    res.end(`<h1> Все примеры: </h1> ${examples}`);
});

export default router;
