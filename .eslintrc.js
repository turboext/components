module.exports = {
    parser: '@typescript-eslint/parser',
    settings: {
        react: {
            version: "detect"
        }
    },
    extends: ['plugin:react/all', 'eslint:all', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        jsx: true,
        useJSXTextNode: true,
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true,
        },
        project: './tsconfig.json'
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'import',
        'babel'
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        'react/jsx-one-expression-per-line': 'off',
        'react/display-name': 'off',
        'react/jsx-filename-extension': ['error', { extensions : ['.tsx'] }],
        'react/jsx-max-props-per-line': ['error', { maximum: 3 }],
        'react/jsx-no-literals': 'off',
        'react/destructuring-assignment': 'off',
        'react/no-set-state': 'off',

        // https://github.com/bradzacher/eslint-plugin-typescript#supported-rules
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
        '@typescript-eslint/generic-type-naming': 1,
        '@typescript-eslint/member-naming': 1,
        '@typescript-eslint/member-ordering': 1,
        '@typescript-eslint/no-extraneous-class': 1,
        '@typescript-eslint/no-for-in-array': 1,
        '@typescript-eslint/no-this-alias': 1,
        '@typescript-eslint/no-type-alias': 1,
        '@typescript-eslint/no-unnecessary-qualifier': 1,
        '@typescript-eslint/no-unnecessary-type-assertion': 1,
        '@typescript-eslint/no-useless-constructor': 1,
        '@typescript-eslint/prefer-function-type': 1,
        '@typescript-eslint/restrict-plus-operands': 1,

        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
        'import/order': ['error', { groups: ['builtin', 'external', 'sibling', 'parent', 'index'] }],

        // https://github.com/babel/eslint-plugin-babel
        'babel/no-invalid-this': 1,

        // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
        'jsx-quotes': ['error', 'prefer-double'],

        'semi': [2, 'always', { 'omitLastInOneLineBlock': true }],
        'semi-spacing': [2, { 'before': false, 'after': true }],
        'wrap-iife': [2, 'inside'],
        'no-use-before-define': [2, 'nofunc'],
        'no-caller': 2,
        'no-cond-assign': 2,
        'no-constant-condition': 2,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty': [2, { 'allowEmptyCatch': true }],
        'no-extra-boolean-cast': 2,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-new': 2,
        'no-sparse-arrays': 2,
        'no-undef': 2,
        'no-unexpected-multiline': 2,
        'no-unreachable': 2,
        'no-unused-vars': [2, { 'vars': 'all', 'args': 'none' }],
        'no-global-strict': 0,
        'max-params': [2, 5],
        'max-depth': [2, 4],
        'no-eq-null': 0,
        'no-unused-expressions': 0,
        'dot-notation': 0,
        'use-isnan': 2,
        'no-ternary': 'off',
        'no-magic-numbers': 'off',
        'multiline-ternary': 'off',
        'object-property-newline': 'off',
        'sort-imports': 'off',
        'no-extra-parens': [2, 'all', { "ignoreJSX": "all" }],
        'no-invalid-this': 'off',
        'max-statements': 'off',
        'id-length': 'off',

        // Codestyle
        'array-bracket-spacing': [2, 'never'],
        'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
        'camelcase': [2, { 'properties': 'never' }],
        'comma-dangle': [2, 'never'],
        'comma-spacing': [2, { 'before': false, 'after': true }],
        'eol-last': 2,
        'func-call-spacing': 2,
        'keyword-spacing': [2, { 'before': true, 'after': true }],
        'max-len': [2, { code: 120, ignoreStrings: true, ignoreComments: true }],
        'no-lonely-if': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multiple-empty-lines': 2,
        'no-trailing-spaces': 2,
        'no-unneeded-ternary': 2,
        'object-curly-spacing': [2, 'always'],
        'one-var-declaration-per-line': [2, 'initializations'],
        'one-var': [2, 'never'],
        'operator-linebreak': [2, 'after'],
        'padded-blocks': [2, 'never'],
        'quote-props': [2, 'as-needed', { unnecessary: true, keywords: true }],
        'quotes': [2, 'single', { 'avoidEscape': true }],
        'space-before-blocks': [2, 'always'],
        'space-in-parens': 2,
        'no-console': [2, { allow: ['assert', 'error', 'warn'] }],
        'key-spacing': [2, { 'beforeColon': false, 'afterColon': true, 'mode': 'strict' }],
        'space-infix-ops': 2,
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed'],
        'arrow-spacing': 'error',
        'space-before-function-paren': ['error', 'never'],

        // Variables
        'no-restricted-globals': [2, 'fdescribe', 'fit'],

        // Best practices
        'block-scoped-var': 2,
        'complexity': 2,
        'curly': [2, 'all'],
        'eqeqeq': [2, 'always', { 'null': 'ignore' }],
        'no-else-return': 2,
        'no-extra-bind': 2,
        'no-return-assign': 0,
        'yoda': 2,
    },
    overrides: [
        {
            files: ['*.tsx'],
            env: {
                browser: true,
            },
        },
        {
            files: ['*.test.tsx'],
            env: {
                browser: true,
            },
        },
        {
            files: ['*.test.ts'],
            globals: {
                sinon: true,
            },
        },
    ],
};
