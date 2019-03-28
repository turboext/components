const { isBinaryExpression, isUnaryExpression } = require('./utils');
const isCorrectOperator = (operator, expected) => expected.some(e => e === operator);

/** Being safe means not to throw */
const isSafeTypeofExpression = ({ type, operator }) => isUnaryExpression(type) && operator === 'typeof';

const validBinaryExpressionFactory =
    (...expectedOperators) => ({ type, operator, left, right }) => isBinaryExpression(type) &&
    isCorrectOperator(operator, expectedOperators) &&
    left.operator === 'typeof' &&
    left.argument.name === 'window' &&
    right.value === 'undefined';

/** "typeof window !== 'undefined'" */
const isValidBinary = validBinaryExpressionFactory('!==', '!=');

/** "typeof window === 'undefined'" */
const isValidBinaryReverse = validBinaryExpressionFactory('===', '==');

module.exports = {
    isValidBinary,
    isValidBinaryReverse,
    isSafeTypeofExpression
};
