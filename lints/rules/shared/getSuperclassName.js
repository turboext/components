const { isMemberExpression, isIdentifier } = require('./utils');

/** Gets the name of extended class */
const getSuperclassName = ({ superClass }) => {
    // React.Component
    if (isMemberExpression(superClass)) {
        let item = superClass;
        // Searching for React in React.SomeModule.Component
        while (item.object) {
            item = item.object;
        }

        return item.name;
    }

    // Component
    if (isIdentifier(superClass)) {
        return superClass.name;
    }

    // Any generated names, like function expressions are not handled
    return false;
};

module.exports = getSuperclassName;
