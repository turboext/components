const globals = require('./globals');
const isSafeReactMethod = require('../shared/isSafeReactMethod');
const getFirstParent = require('../shared/getFirstParent');

module.exports = {
    create(context) {
        const checkIsSafe = ({ identifier: node }) => {
            const startFrom = getFirstParent(node);

            if (isSafeReactMethod(startFrom)) {
                return;
            }
            context.report({
                message: `Variable [${node.name}] should be used only in safe react lifecycle methods`,
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
