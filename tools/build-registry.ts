import { resolve } from 'path';
import { readdirSync, outputFileSync } from 'fs-extra';

const wrapInRegistry = (file: string): string => `window.Registry({'${file}': ` +
    `require('../components/${file}/${file}.tsx').${file}});`;

const componentsRoot = resolve(__dirname, '..', 'components');
const registryPath = resolve(__dirname, '..', '.tmp', 'registry.tsx');

const registry = readdirSync(componentsRoot)
    .map((file: string) => wrapInRegistry(file))
    .join('\n');

// Инициализируем React-компоненты после всех require'ов
outputFileSync(registryPath, `${registry}\nwindow.Ya.initReact();`);
