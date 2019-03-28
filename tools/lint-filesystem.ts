import { resolve } from 'path';
import { readdir, lstatSync } from 'fs-extra';
import pascalCase = require('pascal-case');
import chalk from 'chalk';

const { yellow, green, cyanBright: cyan, redBright: red } = chalk;

const componentsRoot = resolve(__dirname, '..', 'components');
const getErrs = () => readdir(componentsRoot)
    .then(dirs => {
        const errs: string[] = [];

        const promises = dirs.map((dir: string): Promise<void> => {
            const dirName = resolve(componentsRoot, dir);

            if (!lstatSync(dirName).isDirectory()) {
                errs.push(`expected ${green(dirName)} to be a ${yellow('directory')}`);
                return Promise.resolve();
            }

            const pascal = pascalCase(dir);
            if (pascal !== dir) {
                errs.push(`expected ${green(dir)} component to be named using pascal-case, suggestion: ${yellow(pascal)}`);
                return Promise.resolve();
            }

            if (!dir.startsWith('Ext')) {
                errs.push(`expected ${green(dir)} component to start with Ext, suggestion: ${green(`Ext${dir}`)}`);
                return Promise.resolve();
            }

            const expected = `${dir}.tsx`;
            const checkFileExistance = (file: string) => file === expected;

            return readdir(dirName)
                .then(files => files.some(checkFileExistance))
                .then(isExists => {
                    if (!isExists) {
                        errs.push(`expected to find ${green(expected)} in ${yellow(dirName)}`)
                    }
                })
        });

        return Promise.all(promises)
            .then(() => errs);
    });

/**
 * Index errors for better reporting
 * @param error - string representing an error
 * @param index - its index it array
 */
const indexify = (error: string, index: number) => `${cyan(`${index + 1})`)} ${error}`;

getErrs().then(errs => {
    if (!errs.length) {
        return;
    }

    console.log(red('\nSome directory linting errors were found:'));
    const result = errs.map(indexify).join('\n');
    console.log(result);

    process.exit(1);
});
