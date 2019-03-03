const { isImportDeclaration, isLiteral } = require('./utils');

/** An import from "react" library is considered to react-import */
const isReactImport = node => isImportDeclaration(node) && isLiteral(node.source) && node.source.value === 'react';

/** Traverses through import declarations and detects if superclass was used is an import of react */
const isReactModuleImport = (node, names) => isReactImport(node) &&
    node.specifiers.some(({ local: { name } }) => names.includes(name));

/** Traverses through all the tree searching for imports and checking them for react */
const isReactImportedNames = (node, ...importNames) => node.body.some(n => isReactModuleImport(n, importNames));

module.exports = isReactImportedNames;
