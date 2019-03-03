
const getType = nodeOrType => typeof nodeOrType === 'string' ? nodeOrType : nodeOrType.type;

const is = name => nodeOrType => getType(nodeOrType) === name;

// Some type detection functions to avoid silly typos
const isLogicalExpression = is('LogicalExpression');
const isBinaryExpression = is('BinaryExpression');
const isMemberExpression = is('MemberExpression');
const isUnaryExpression = is('UnaryExpression');
const isIdentifier = is('Identifier');
const isVariableDeclaration = is('VariableDeclaration');
const isAssignmentExpression = is('AssignmentExpression');
const isMethodDefinition = is('MethodDefinition');
const isClassDeclaration = is('ClassDeclaration');
const isImportDeclaration = is('ImportDeclaration');
const isLiteral = is('Literal');
const isExportDefaultDeclaration = is('ExportDefaultDeclaration');

// Is root sounds better
const isRoot = is('Program');

/** Detects if node is ternary or "normal" if-statement */
const isCondition = nodeOrType => [
    is('IfStatement'),
    is('ConditionalExpression')
].some(fn => fn(nodeOrType));

// Some preconfigured logical operators detectors to improve readability
const isConjunction = ({ operator }) => operator === '&&';
const isDisjunction = ({ operator }) => operator === '||';

/** Unwraps an expression from some unary operators and detects if it can be used */
const unwrapUnaryOperator = node => {
    let isTheOpposite = false;
    let item = node;

    while (isUnaryExpression(item) && [
        '+',
        '-',
        '!'
    ].includes(item.operator)) {
        isTheOpposite = node.operator === '!' ? !isTheOpposite : isTheOpposite;
        item = item.argument;
    }

    return { isTheOpposite, item };
};

/** Traverse through tree to find if an expression is used within logical operators */
const getLogicalExpressionParent = node => {
    let item = node;

    while (!isRoot(item.parent) && !isLogicalExpression(item.parent)) {
        item = item.parent;
    }

    return { item, parent: item.parent };
};

module.exports = {
    isLogicalExpression,
    isBinaryExpression,
    isMemberExpression,
    isUnaryExpression,
    isIdentifier,
    isVariableDeclaration,
    isAssignmentExpression,
    isMethodDefinition,
    isClassDeclaration,
    isImportDeclaration,
    isExportDefaultDeclaration,
    isLiteral,

    isRoot,
    isCondition,

    isConjunction,
    isDisjunction,

    unwrapUnaryOperator,
    getLogicalExpressionParent
};
