const { isRoot, isMethodDefinition, isIdentifier, isClassDeclaration } = require('./utils');

const isReactImportedNames = require('./isReactImportedNames');
const getSuperclassName = require('./getSuperclassName');

/** @see http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/ */
const safeReactMethods = [
    'componentDidMount',
    'shouldComponentUpdate',
    'getSnapshotBeforeUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
];

/** Any valid react class component extends react module */
const isClassMethod = item => isClassDeclaration(item) && item.superClass;

/** Checks for node to be a candidate for react lifecycle method */
const isValidMethod = item => isMethodDefinition(item) &&
    isIdentifier(item.key) &&
    safeReactMethods.includes(item.key.name) &&
    isClassMethod(item.parent.parent);

/** Detects if variable was used in client-only react method */
const isSafeReactMethod = node => {
    let item = node;
    // Detects class definition and method definition names are correct
    const importNames = [];

    while (!isRoot(item)) {
        if (isValidMethod(item)) {
            const name = getSuperclassName(item.parent.parent);
            name && importNames.push(name);
        }

        item = item.parent;
    }

    return Boolean(importNames.length) && isReactImportedNames(item, ...importNames);
};

module.exports = isSafeReactMethod;
