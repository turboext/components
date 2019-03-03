const { isValidBinary, isValidBinaryReverse } = require('./isValidBinaryExpression');
const { isValidLogicalInner, isValidLogicalInnerReverse } = require('./isValidLogicalInner');
const { isIdentifier, isRoot, isVariableDeclaration, isAssignmentExpression, unwrapUnaryOperator } = require('../shared/utils');

/** Traverse through assignment tree to detect the most-left value */
const getAssignment = ({ init }) => {
    // Empty declaration: e.g. let somVar;
    if (!init) {
        return init;
    }

    let expression = init;

    // Handling multiple assignment case, e.g. const a = b = c = '123'
    while (isAssignmentExpression(expression)) {
        expression = expression.right;
    }

    return expression;
};

/** Declaration is valid if contains valid logical or binary expression */
const isValidDeclaration = assignment => isValidBinary(assignment) ||
    isValidLogicalInner(assignment);

/** Mirrored version of upper function */
const isValidDeclarationReverse = assignment => isValidBinaryReverse(assignment) ||
    isValidLogicalInnerReverse(assignment);

/**
 * We consider that identifier is valid iff
 * 1) it is constant
 * 2) it points to valid typeof expression or valid logical expression
 */
const isValidIdentifierBase = isReverse => node => {
    const result = unwrapUnaryOperator(node);
    let { item } = result;

    if (!isIdentifier(item)) {
        return false;
    }

    // Reverse declaration is used if any and only one of the declarations is true
    /* eslint-disable-next-line no-bitwise */
    const checkFunction = result.isTheOpposite ^ isReverse ?
        isValidDeclarationReverse : isValidDeclaration;

    const { name } = item;

    do {
        item = item.parent;
        const { body } = item;

        // Some nodes have null, undefined or object (not array) body
        if (body && Array.isArray(body)) {
            for (const bodyNode of body) {
                // Traversing through body searching for declaration of our variable
                if (!isVariableDeclaration(bodyNode)) {
                    continue;
                }

                const { kind, declarations } = bodyNode;

                // One node can have several declarations: e.g. let i = 0, b =1;
                for (const decl of declarations) {
                    // When found our variable we need to return from function its value
                    /* eslint-disable max-depth */
                    if (decl.id.name === name) {
                        const assignment = getAssignment(decl);
                        // Constant variable can still have null assignment (so strange!)
                        return assignment !== null && kind === 'const' &&
                            checkFunction(assignment);
                    }
                }
            }
        }
    } while (!isRoot(item));

    return false;
};

const isValidIdentifier = isValidIdentifierBase(false);
const isValidIdentifierReverse = isValidIdentifierBase(true);

module.exports = {
    isValidIdentifier,
    isValidIdentifierReverse
};
