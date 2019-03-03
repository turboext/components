const { relative, resolve, basename } = require('path');
const { isExportDefaultDeclaration, isClassDeclaration, isIdentifier } = require('../shared/utils');
const getSuperclassName = require('../shared/getSuperclassName');
const isReactImportedNames = require('../shared/isReactImportedNames');

const base = resolve(__dirname, '..', '..', '..');
const itemRe = /components\/([^/]+)\/(\1)\.tsx/u;

const correctExport = node => [
    isIdentifier,
    isClassDeclaration
].some(fn => fn(node));

module.exports = {
    create(context) {
        return {
            Program(node) {
                // Get the context of the program
                const local = relative(base, context.getFilename());
                if (!itemRe.test(local)) {
                    console.log(local);
                    return;
                }

                const componentName = basename(local, '.tsx');

                const exports = node.body.filter(isExportDefaultDeclaration);
                const declarations = node.body.filter(isClassDeclaration);

                const names = exports.map(({ declaration }) => {
                    if (!correctExport(declaration)) {
                        return null;
                    }

                    const declarationFinder = decl => isIdentifier(decl.id) && decl.id.name === declaration.name;

                    const classInstance = isClassDeclaration(declaration) ?
                        declaration :
                        declarations.find(declarationFinder);

                    return classInstance ? {
                        name: classInstance.id.name,
                        module: getSuperclassName(classInstance)
                    } : null;
                });

                const reactClasses = names.filter(({ module, name }) => isReactImportedNames(node, module) &&
                    name === componentName);

                if (!reactClasses.length) {
                    context.report({
                        message: `No default export of class ${componentName} extending react was found`,
                        node
                    });
                }
            }

        };
    },

    meta: {
        docs: {
            category: 'Turbo Custom Components custom lints',
            description: 'Disallow usage of window in node.js and browser environments without typeof guard',
            url: 'https://github.com/turboext/ugc/tree/master/lints/eslint/no-undefined-window/Readme.md'
        },
        schema: []
    }
};
