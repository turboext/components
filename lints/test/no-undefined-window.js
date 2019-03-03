/* eslint-disable max-lines */
// (it's tests, common!)
const { RuleTester } = require('eslint');
const { getCreateSuite } = require('./utils');

const rule = require('../rules/no-undefined-window');

const ruleTester = new RuleTester();

const createErrorMessage = varName => `Variable [${varName}] should be protected via (typeof window !== 'undefined')`;
const createSuite = getCreateSuite(createErrorMessage);

ruleTester.run('no-undefined-window', rule, {
    valid: [
        // Valid usage
        createSuite('const a = \'a\''),

        // Nodejs and browser shared globals
        createSuite('console.log(\'hello world!\')'),

        // Local variables
        createSuite('function getWindow() { const window = \'window\'; window.toString() }'),

        // Typeof window itslef
        createSuite('typeof window !== \'undefined\''),

        // Still valid misuse
        createSuite('typeof document !== undefined'),

        // Simple typeof operation
        createSuite('typeof document'),

        // Reverse typeof window itslef
        createSuite('typeof window === \'undefined\''),

        // Logical expression with typeof wi ndow
        createSuite('typeof window !== \'undefined\' && window.document.title'),

        // Logical expression with reverse typeof window
        createSuite('typeof window === \'undefined\' || window.document.title'),

        // Logical expression with typeof window coming second
        createSuite('doStuff && typeof window !== \'undefined\' && window.document.title'),

        // Logical expression with reverse typeof window coming second
        createSuite('doStuff || typeof window === \'undefined\' || window.document.title'),

        // Logical expression with typeof window coming second and conjunction
        createSuite('doStuff || typeof window !== \'undefined\' && window.document.title'),

        // Logical expression with reverse typeof window coming second and conjunction
        createSuite('doStuff && (typeof window === \'undefined\' || window.document.title)'),

        // More complex logical expression
        createSuite('typeof window !== \'undefined\' && window.document && ' +
            'window.document.createElement'),

        // More complex logical expression with reverse typeof window
        createSuite('typeof window === \'undefined\' || window.document || ' +
            'window.document.createElement'),

        // More complex logical expression with typeof window coming second
        createSuite('doStuff && typeof window !== \'undefined\' && window.document && ' +
            'window.document.createElement'),

        // Some tricky condition
        createSuite('const a = typeof window !== \'undefined\' && (window.someValue + window.otherValue)'),

        // Some tricky condition reverse
        createSuite('const a = typeof window === \'undefined\' || (window.someValue + window.otherValue)'),

        // More complex logical expression with reverse typeof window coming second
        createSuite('doStuff || typeof window === \'undefined\' || window.document || ' +
            'window.document.createElement'),

        // More complex logical expression with disjunction
        createSuite('(typeof window !== \'undefined\' && window.document) || ' +
            '(typeof window !== \'undefined\' && window.document.createElement)'),

        // More complex logical expression with conjuction and reverse typeof
        createSuite('(typeof window === \'undefined\' || window.document) && ' +
            '(typeof window === \'undefined\' || window.document.createElement)'),

        // Guarded expression
        createSuite('if (typeof window !== \'undefined\') {alert(123)}'),

        // Guarded expression with reverse typeof
        createSuite('if (typeof window === \'undefined\') {console.log(123)} else ' +
            '{alert(123)}'),

        // Expression guarded by logical expression
        createSuite('if (typeof window !== \'undefined\' && window.document.title) ' +
            '{alert(123)}'),

        // Expression guarded by logical expression with reverse typeof
        createSuite('if (typeof window === \'undefined\' || window.document.title) ' +
            '{console.log(123)} else {alert(123)}'),

        // Expression guarded by more complex logical expression
        createSuite('if (typeof window !== \'undefined\' && window.document && ' +
            'window.document.createElement){window.document.createElement}'),

        // Expression guarded by more complex logical expression with reverse typeof
        createSuite('if (typeof window === \'undefined\' || window.document || ' +
            'window.document.createElement){as()} else {window.document.createElement}'),

        // Expression guarded by more complex logical expression with disjunction
        createSuite('if (typeof window !== \'undefined\' && (window.document.title || ' +
            'window.savedTitle)) {window.alert(123)}'),

        // Expression guarded by more complex logical expression with disjunction and reverse typeof
        createSuite('if (typeof window === \'undefined\' || (window.document.title && ' +
            'window.savedTitle)){doStuff()} else {window.alert(123)}'),

        // Expression guarded by more complex logical expression with disjunction
        createSuite('if (typeof window !== \'undefined\' && (window.document.title && ' +
            'window.savedTitle)) {window.alert(123)}'),

        // Expression guarded by more complex logical expression with disjunction and reverse typeof
        createSuite('if (typeof window === \'undefined\' || (window.document.title || ' +
            'window.savedTitle)){doStuff()} else {window.alert(123)}'),

        // Expression guarded by more complex logical expression with disjunction
        createSuite('if ((typeof window !== \'undefined\' && window.document) || ' +
            '(typeof window !== \'undefined\' && window.document.createElement)) {alert(123)}'),

        // Expression guarded by more complex logical expression with conjunction and reverse typeof
        createSuite('if ((typeof window === \'undefined\' || window.document) && ' +
            '(typeof window === \'undefined\' || window.document.createElement)) {doStuff()} else {alert(123)}'),

        // Ternary operator
        createSuite('typeof window !== \'undefined\' ? window.title : \'title\''),

        // Ternary operator reverse
        createSuite('typeof window === \'undefined\' ? \'title\' : window.title'),

        // Nested conditions
        createSuite('if (typeof window !== \'undefined\') {if (window.title) ' +
            '{ console.log(window.title) } }'),

        // Nested conditions reverse
        createSuite('if (typeof window === \'undefined\') {doStuff} else ' +
            '{ if (window.title) { console.log(window.title) } }'),

        // Condition with reassignment
        createSuite('let img; if (typeof window !== \'undefined\') { img = new Image() }'),

        // Reverse condition with reassignment
        createSuite('let img; if (typeof window === \'undefined\') {img = \'I am img\'} ' +
            'else { img = new Image() }'),

        // Non-strict comparison
        createSuite('if (typeof window != \'undefined\') { alert(123) }'),

        // Non-strict comparison with reverse typeof
        createSuite('if (typeof window == \'undefined\') {doStuff()} else { alert(123) }'),

        // Local variable containing typeof
        createSuite('function abc() {const canUseDom = typeof window !== \'undefined\'; ' +
            'if (canUseDom) {alert(123)}}'),

        // Local variable containing reverse typeof
        createSuite('function abc() {const cantUseDom = typeof window === \'undefined\'; if ' +
            '(cantUseDom) {console.log(123)} else {alert(123)}}'),

        // Local variable containing logical expression
        createSuite('function abc() {const canUseDom = typeof window !== \'undefined\'' +
            ' && window.document; if (canUseDom) {alert(123)}}'),

        // Local variable containing logical expression with reverse typeof
        createSuite('function abc() {const cantUseDom = typeof window === \'undefined\' ' +
            '|| !window.document; if (cantUseDom) {console.log(123)} else {alert(123)}}'),

        // Local variable containing logical expression at the root
        createSuite('const canUseDom = typeof window !== \'undefined\' && window.document; ' +
            'if (canUseDom) {alert(123)}'),

        // Local variable containing logical expression at the root
        createSuite('const cantUseDom = typeof window === \'undefined\' || !window.document; ' +
            'if (cantUseDom) {console.log(123)} else {alert(123)}'),

        // Local variable containing logical expression at the root
        createSuite('const canUseDom = typeof window !== \'undefined\' && window.document; ' +
            'if (!canUseDom) {console.log(123)} else {alert(123)}'),

        // Local variable containing logical expression at the root with reverse typeof
        createSuite('const cantUseDom = typeof window === \'undefined\' || !window.document; ' +
            'if (!cantUseDom) {alert(123)} else {console.log(123)}'),

        // Local variable inside logical expression
        createSuite('const canUseDom = typeof window !== \'undefined\' && window.document; ' +
            'canUseDom && alert(2)'),

        // Local variable inside logical expression reverse
        createSuite('const cantUseDom = typeof window == \'undefined\' || !window.document; ' +
            'cantUseDom || alert(2)'),

        // Local variable inside logical expression with negation
        createSuite('const canUseDom = typeof window !== \'undefined\' && window.document; ' +
            '!canUseDom || alert(2)'),

        // Local variable inside logical expression with negation
        createSuite('const cantUseDom = typeof window == \'undefined\' || !window.document; ' +
            '!cantUseDom && alert(2)'),

        // Local variable inside logical expression with negation
        createSuite('const canUseDom = !(typeof window !== \'undefined\' && window.document); ' +
            'canUseDom || alert(2)'),

        // Local variable inside logical expression with negation
        createSuite('const cantUseDom = !(typeof window == \'undefined\' || !window.document); ' +
            'cantUseDom && alert(2)'),

        // Local variable inside logical expression with multiple negations
        createSuite('const canUseDom = !!!(typeof window !== \'undefined\' && window.document); ' +
            'canUseDom || alert(2)'),

        // Local variable inside logical expression with multiple negations
        createSuite('const cantUseDom = !!!(typeof window == \'undefined\' || !window.document); ' +
            'cantUseDom && alert(2)'),

        // React safe lifecycle and namespace import
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { alert(123) } }'),

        // React safe lifecycle with default import
        createSuite('import React from \'react\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { alert(123) } }'),

        // React safe lifecycle with named import
        createSuite('import {Component} from \'react\'; class myComponent extends Component' +
            ' { componentDidMount() { alert(123) } }'),

        // React safe lifecycle with named import
        createSuite('import {Component} from \'react\'; class myComponent extends Component' +
            ' { componentDidMount() { class Alerter { alert() { alert(123) } }; (new Alerter).alert(); } }'),

        // React safe lifecycle with named import named different locally
        createSuite('import {Component as a} from \'react\'; class myComponent extends a' +
            ' { componentDidMount() { class Alerter { alert() { alert(123) } }; (new Alerter).alert(); } }')
    ],
    invalid: [
        // Single variable usage
        createSuite('window', 'window'),

        // Single variable usage as member expression
        createSuite('window.document', 'window'),

        // Basic misuse
        createSuite('const title = window.document.title', 'window'),

        // Disjunction instead when conjunction needed
        createSuite('typeof window !== \'undefined\' || window.title', 'window'),

        // Conjunction instead when disjunction needed
        createSuite('typeof window === \'undefined\' && window.title', 'window'),

        // Call to alert
        createSuite('alert(124)', 'alert'),

        // Error in condition
        createSuite('if (document.title) {console.log(\'hacked!\')}', 'document'),

        // Ternary operator
        createSuite(
            'typeof window !== \'undefined\' ? \'title\' : postMessage(document.title)',
            'postMessage', 'document'
        ),

        // Ternary operator reverse
        createSuite('typeof window === \'undefined\' ? alert(innerHeight) : \'title\'', 'alert', 'innerHeight'),

        // Else option
        createSuite('if (typeof window !== \'undefined\') {doStuff()} else {alert(\'fail!\')}', 'alert'),

        // Else option reverse
        createSuite(
            'if (typeof window === \'undefined\') {fetch(\'https://yandex.ru/turbo\')} else {doStuff()}',
            'fetch'
        ),

        // Complicated else option
        createSuite('if (typeof window !== \'undefined\') {doStuff()} else if (a) ' +
            '{doStuff()} else {alert(true)}', 'alert'),

        // Invalid condition with conjunction
        createSuite('if (typeof window === \'undefined\' || true) { console.log(document.title) }', 'document'),

        // Local variable containing useless expression
        createSuite('const canUseDom = 123; if (canUseDom) {alert(123)}', 'alert'),

        // Local variable with tricky assignment
        createSuite('const canUseDom = !(!(typeof window !== \'undefined\')); if (!canUseDom) {alert(123)}', 'alert'),

        // Local variable with multiple assignments and tricky condition
        createSuite('let a; const canUseDom = !(a = true || !!!(typeof window !== \'undefined\' && window.document)); ' +
            'canUseDom || alert(2)', 'alert'),

        // Local variable containing tricky and multiple assignment
        createSuite('let a; const canUseDom = (!(a = typeof window !== \'undefined\')); if (canUseDom) {alert(123)}', 'alert'),

        // Let variable
        createSuite('let canUseDom = typeof window !== \'undefined\'; if (canUseDom) {alert(123)}', 'alert'),

        // Var variable
        createSuite('var canUseDom = typeof window !== \'undefined\'; if (canUseDom) {alert(123)}', 'alert'),

        // Local variable containing incorrect logical expression
        createSuite('function abc() {const canUseDom = typeof window !== \'undefined\' || window.document; ' +
            'if (canUseDom) {alert(123)}}', 'window', 'alert'),

        // Local variable containing useless expression with helpful variable declared higher in the scope
        createSuite('const canUseDom = typeof window !== \'undefined\'; function abc() {const canUseDom = 123; ' +
            'if (canUseDom) {alert(123)}}', 'alert'),

        // Local variable inside logical expression with multiple negations
        createSuite('const canUseDom = !!(typeof window !== \'undefined\' && window.document); ' +
            'canUseDom || alert(2)', 'alert'),

        // Local variable inside logical expression with multiple negations
        createSuite('const cantUseDom = !!(typeof window == \'undefined\' || !window.document); ' +
            'cantUseDom && alert(2)', 'alert'),

        // React-named module class with safe lifecycle
        createSuite('import * as React from \'some-fake\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { alert(123) } }', 'alert'),

        // React class with unsafe lifecycle
        createSuite('import * as React from \'react\'; class myComponent extends React.PureComponent' +
            ' { render() { alert(123) } }', 'alert'),

        // Incorrect named module
        createSuite('import react from \'react\'; class myComponent extends React.PureComponent' +
            ' { componentDidMount() { alert(123) } }', 'alert'),

        // Fake module lifecycle hook
        createSuite('import React from \'react\'; import Fake from \'fake\'; class myComponent' +
            ' extends Fake.PureComponent { componentDidMount() { alert(123) } }', 'alert'),

        // Simple object class definition
        createSuite('const obj = { componentDidUpdate() { alert(123) } }', 'alert')
    ]
});
