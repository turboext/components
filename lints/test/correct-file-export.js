const { resolve } = require('path');
const { RuleTester } = require('eslint');

const { getCreateSuite } = require('./utils');
const rule = require('../rules/correct-file-export');

const ruleTester = new RuleTester();

const filename = resolve(__dirname, '..', '..', 'components', 'myComponent', 'myComponent.tsx');

const createErrorMessage = () => 'No default export of class myComponent extending react was found';
const createSuite = getCreateSuite(createErrorMessage, { filename });

ruleTester.run('correct-file-export', rule, {
    valid: [
        // React safe lifecycle and namespace import
        createSuite('import * as React from \'react\'; export default class myComponent extends React.PureComponent' +
            ' { componentDidMount() { setTimeout(() => console.log(123), 123) } }'),

        // React safe lifecycle and namespace import
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { setTimeout(() => console.log(123), 123) } }; export default myComponent;')
    ],
    invalid: [
        // React unsafe lifecycle and namespace import — setTimeout
        createSuite('import * as React from \'react\'; class MyComponent extends React.PureComponent' +
            ' { render() { setTimeout(() => console.log(123), 123) } }', 'setTimeout'),

        // React unsafe lifecycle and namespace import - setInterval
        createSuite('import * as React from \'asd\'; class myComponent extends React.PureComponent' +
            ' { constructor() { setInterval(() => console.log(123), 123) } }', 'setInterval')
    ]
});
