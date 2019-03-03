const { RuleTester } = require('eslint');

const { getCreateSuite } = require('./utils');
const rule = require('../rules/no-async');

const ruleTester = new RuleTester();

const createErrorMessage = varName => `Variable [${varName}] should be used only in safe react lifecycle methods`;
const createSuite = getCreateSuite(createErrorMessage);

ruleTester.run('no-undefined-window', rule, {
    valid: [
        // React safe lifecycle and namespace import
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { setTimeout(() => console.log(123), 123) } }'),

        // React safe lifecycle and namespace import
        createSuite('function asyncFn(setTimeout) {setTimeout(() => alert(2), 100)}')
    ],
    invalid: [
        // React unsafe lifecycle and namespace import — setTimeout
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { render() { setTimeout(() => console.log(123), 123) } }', 'setTimeout'),

        // React unsafe lifecycle and namespace import - setInterval
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { constructor() { setInterval(() => console.log(123), 123) } }', 'setInterval'),

        // React unsafe lifecycle and namespace import - new Promise
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { getDerivedStateFromProps() { new Promise(\'a\') } }', 'Promise'),

        // React unsafe lifecycle and namespace import - Promise.resolve()
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { render() { Promise.resolve() } }', 'Promise')
    ]
});
