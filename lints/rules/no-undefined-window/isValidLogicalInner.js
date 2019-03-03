const { isValidBinary, isValidBinaryReverse } = require('./isValidBinaryExpression');
const { isDisjunction, isConjunction, isLogicalExpression, unwrapUnaryOperator } = require('../shared/utils');

/* Btw, I tried to create base function to derive normal and reverse ones, but it scared me so I stopped */

/** Check if node is valid logical expression (used to check IfStatement and complex logical expressions) */
function isValidLogicalInner(node) {
    // Require directly in function to resolve circle dependencies
    /* eslint-disable-next-line global-require */
    const { isValidIdentifier } = require('./isValidIdentifier');

    const { item, isTheOpposite } = unwrapUnaryOperator(node);

    if (isTheOpposite) {
        return isValidLogicalInnerReverse(item);
    }

    if (!isLogicalExpression(item)) {
        return false;
    }

    const { left, right } = item;

    /*
     * If conjunction any of the guards should be correct
     * E.g. typeof window !== 'undefined' && someStuff
     */
    if (isConjunction(item)) {
        // From fastest to slowest; 1) isBinary (checks only node)
        return isValidBinary(left) ||
            isValidBinary(right) ||
            // 2) IsValidLogicalInner (checks for full logical expression)
            isValidLogicalInner(left) ||
            isValidLogicalInner(right) ||
            // 3) IsValidIdentifier (traverse through the all tree up to the root)
            isValidIdentifier(left) ||
            isValidIdentifier(right);
    }

    /*
     * If disjunction every of the guards should be correct
     * e.g. (typeof window !== 'undefined' && someStuff) || (typeof window !== 'undefined' && someOtherStuff)
     */
    return (isValidBinary(left) || isValidLogicalInner(left) || isValidIdentifier(left)) &&
        (isValidBinary(right) || isValidLogicalInner(right) || isValidIdentifier(right));
}

/** Mirrored version of isValidLogicalInner*/
function isValidLogicalInnerReverse(node) {
    /* eslint-disable-next-line global-require */
    const { isValidIdentifierReverse } = require('./isValidIdentifier');

    const { item, isTheOpposite } = unwrapUnaryOperator(node);

    if (isTheOpposite) {
        return isValidLogicalInner(item);
    }

    if (!isLogicalExpression(item)) {
        return false;
    }

    const { left, right } = item;

    // E.g. typeof window === undefined || someStuff
    if (isDisjunction(node)) {
        return isValidBinaryReverse(left) ||
            isValidBinaryReverse(right) ||
            isValidLogicalInnerReverse(left) ||
            isValidLogicalInnerReverse(right) ||
            isValidIdentifierReverse(left) ||
            isValidIdentifierReverse(right);
    }

    // E.g.  (typeof window === 'undefined' || someStuff) && (typeof window === 'undefined' || someOtherStuff)
    return (isValidBinaryReverse(left) || isValidLogicalInnerReverse(left) || isValidIdentifierReverse(left)) &&
        (isValidBinaryReverse(right) || isValidLogicalInnerReverse(right) || isValidIdentifierReverse(right));
}

module.exports = {
    isValidLogicalInner,
    isValidLogicalInnerReverse
};
