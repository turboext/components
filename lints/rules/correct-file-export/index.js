const { relative, resolve, basename } = require('path');
const { isExportNamedDeclaration, isClassDeclaration, isFunctionDeclaration, isIdentifier } = require('../shared/utils');
const getSuperclassName = require('../shared/getSuperclassName');
const isReactImportedNames = require('../shared/isReactImportedNames');

const base = resolve(__dirname, '..', '..', '..');
const itemRe = /components\/([^/]+)\/(\1)\.tsx/u;

const correctExport = node => [
    isIdentifier,
    isClassDeclaration,
    isFunctionDeclaration
].some(fn => fn(node));

module.exports = {
    // eslint-disable-next-line max-lines-per-function
    create(context) {
        return {
            // eslint-disable-next-line max-lines-per-function
            Program(node) {
                // Get the context of the program
                const local = relative(base, context.getFilename());
                if (!itemRe.test(local)) {
                    return;
                }

                const componentName = basename(local, '.tsx');

                const exports = node.body.filter(isExportNamedDeclaration);

                const classDeclarations = node.body.filter(isClassDeclaration);
                const functionDeclarations = node.body.filter(isFunctionDeclaration);
                const findDeclarationByTypeAndName = (decls, name) => decls
                    .find(decl => isIdentifier(decl.id) && decl.id.name === name);

                const names = exports.map(({ declaration, specifiers }) => {
                    let currentDecl = declaration;

                    // For: export { aaa, bbb }
                    if (specifiers.length) {
                        const exportNamedAsFile = specifiers
                            .find(decl => decl.exported.name === componentName);

                        if (!exportNamedAsFile) {
                            return null;
                        }

                        currentDecl = findDeclarationByTypeAndName(classDeclarations, componentName) ||
                            findDeclarationByTypeAndName(functionDeclarations, componentName);
                    }

                    if (!currentDecl || !correctExport(currentDecl)) {
                        return null;
                    }

                    const classInstance = isClassDeclaration(currentDecl) ?
                        currentDecl :
                        findDeclarationByTypeAndName(classDeclarations, currentDecl.name);

                    if (classInstance) {
                        const module = getSuperclassName(classInstance);

                        if (!module || !isReactImportedNames(node, module)) {
                            return null;
                        }

                        return {
                            name: classInstance.id.name
                        };
                    }

                    const functionInstance = isFunctionDeclaration(currentDecl) && currentDecl;

                    if (functionInstance) {
                        return {
                            name: functionInstance.id.name
                        };
                    }

                    return null;
                });

                const reactClassesOfFunctions = names
                    .filter(Boolean)
                    .filter(({ name }) => name === componentName);

                if (!reactClassesOfFunctions.length) {
                    context.report({
                        message: `No named export of class or function declaration in ${componentName} was found`,
                        node
                    });
                }
            }

        };
    },

    meta: {
        docs: {
            category: 'Turbo Custom Components custom lints',
            description: 'Disallow usage of default exports in components',
            url: 'https://github.com/turboext/custom-components/tree/master/lints/eslint/correct-file-export/Readme.md'
        },
        schema: []
    }
};
