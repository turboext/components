import { resolve } from 'path';
import { readdirSync, outputFileSync } from 'fs-extra';

const wrapInRegistry = (file: string) =>
    `window.Registry({'${file}': require('../components/${file}/${file}.tsx').default});`;

const componentsRoot = resolve(__dirname, '..', 'components');
const registryPath = resolve(__dirname, '..', '.tmp', 'registry.tsx');

const registry = readdirSync(componentsRoot)
    .map((file: string) => wrapInRegistry(file))
    .join('\n');

outputFileSync(registryPath, registry);
