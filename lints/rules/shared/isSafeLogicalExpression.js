
const { isValidBinary, isValidBinaryReverse } = require('./isValidBinaryExpression');
const { isValidLogicalInner, isValidLogicalInnerReverse } = require('./isValidLogicalInner');
const { isValidIdentifier, isValidIdentifierReverse } = require('./isValidIdentifier');
const { isConjunction, isDisjunction, isLogicalExpression, getLogicalExpressionParent } = require('./utils');

/** Checks the node is the right part of logical statement */
const isRight = node => node.parent.right === node;

/** Considering node valid if test is the left part guards the right part */
const isValid = (node, parent) => (isValidBinary(parent.left) ||
    isValidLogicalInner(parent.left) ||
    isValidIdentifier(parent.left)) &&
    isConjunction(parent) && isRight(node);

/** Mirrored version of upper function */
const isValidReverse = (node, parent) => (isValidBinaryReverse(parent.left) ||
    isValidLogicalInnerReverse(parent.left) ||
    isValidIdentifierReverse(parent.left)) &&
    isDisjunction(parent) && isRight(node);

/** Safe logical is the first function to call on node */
const isValidLogical = node => {
    const { item, parent } = getLogicalExpressionParent(node);

    if (!isLogicalExpression(parent)) {
        return false;
    }

    /*
     * If is not valid still can be guarded by upper logical expression:
     * E.g. window.document.title || window.savedTitle will be correct if an expression is guarded with conjunction,
     * e.g. typeof window !== undefined && (window.document.title || window.savedTitle).
     * Which can be done by the function itself recursively.
     */

    return isValid(item, parent) || isValidLogical(parent);
};

const isValidLogicalReverse = node => {
    const { item, parent } = getLogicalExpressionParent(node);

    if (!isLogicalExpression(parent)) {
        return false;
    }

    return isValidReverse(item, parent) || isValidLogicalReverse(parent);
};

const isSafeLogicalExpression = node => isValidLogical(node) || isValidLogicalReverse(node);

module.exports = { isSafeLogicalExpression };
