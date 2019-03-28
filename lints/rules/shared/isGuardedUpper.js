const { isValidIdentifier, isValidIdentifierReverse } = require('./isValidIdentifier');
const { isValidBinary, isValidBinaryReverse } = require('./isValidBinaryExpression');
const { isValidLogicalInner, isValidLogicalInnerReverse } = require('./isValidLogicalInner');
const { isCondition, isRoot } = require('./utils');

/** Returns true if node condition is guarded with "typeof window !== undefined" and statement of node in the consequent block */
const isValid = ({ test, consequent }, prevItem) => (isValidBinary(test) ||
    isValidIdentifier(test) ||
    isValidLogicalInner(test)) &&
    prevItem === consequent;

/** Same as function above but mirrored */
const isValidReverse = ({ test, alternate }, prevItem) => (isValidBinaryReverse(test) ||
    isValidIdentifierReverse(test) ||
    isValidLogicalInnerReverse(test)) &&
    prevItem === alternate;

/** Checks for typeof window handled upper in the scope */
const isGuardedUpper = node => {
    let item = node;
    let prevItem = node;

    while (!isRoot(item.parent)) {
        prevItem = item;
        item = item.parent;

        if (isCondition(item) && (isValid(item, prevItem) || isValidReverse(item, prevItem))) {
            return true;
        }
    }

    return false;
};

module.exports = isGuardedUpper;
