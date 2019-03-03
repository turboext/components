const { isMemberExpression, isUnaryExpression } = require('./utils');

/** Gets the first parent to search for correctness from node item */
const getFirstParent = node => {
    // Always node.type === identifier

    // E.g. window.document
    if (isMemberExpression(node.parent)) {
        let { parent: item } = node;

        // Fetching the highest memberExpression from window.document.somevalue
        while (isMemberExpression(item.parent)) {
            item = item.parent;
        }

        return item;
    }

    // E.g. typeof window
    if (isUnaryExpression(node.parent)) {
        // E.g. Binary expression: typeof window !== undefined
        return node.parent;
    }

    // AssignmentExpression, VariableDeclaration, Program; whatever, will search for If pattern higher in the scope
    return node;
};

module.exports = getFirstParent;
