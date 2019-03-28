const globals = require('./globals');

const { isSafeTypeofExpression } = require('../shared/isValidBinaryExpression');
const { isSafeLogicalExpression } = require('../shared/isSafeLogicalExpression');
const isGuardedUpper = require('../shared/isGuardedUpper');
const isSafeReactMethod = require('../shared/isSafeReactMethod');

const getFirstParent = require('../shared/getFirstParent');

module.exports = {
    create(context) {
        const checkIsSafe = ({ identifier: node }) => {
            const startFrom = getFirstParent(node);

            // From fastest to slowest

            // Typeof window
            if (isSafeTypeofExpression(startFrom) ||
                // Typeof window !== undefined && document
                isSafeLogicalExpression(startFrom) ||
                // ComponentDidMount() { alert('mounted!' }
                isSafeReactMethod(startFrom) ||
                // If (typeof window !== 'undefined') {alert('window is defined!')}
                isGuardedUpper(startFrom)) {
                return;
            }
            context.report({
                message: `Variable [${node.name}] should be protected via (typeof window !== 'undefined')`,
                node
            });
        };

        return {
            Program() {
                // Get the context of the program
                const scope = context.getScope();
                scope.variables.forEach(variable => {
                    if (!variable.defs.length && globals.has(variable.name)) {
                        variable.references.forEach(checkIsSafe);
                    }
                });

                // Report variables not declared at all
                scope.through.forEach(reference => {
                    if (globals.has(reference.identifier.name)) {
                        checkIsSafe(reference);
                    }
                });
            }
        };
    },

    meta: {
        docs: {
            category: 'Turbo Custom Components custom lints',
            description: 'Disallow usage of window in node.js and browser environments without typeof guard',
            url: 'https://github.com/turboext/ugc/tree/master/lints/eslint/no-undefined-window/Readme.md'
        },
        schema: []
    }
};
