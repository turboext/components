module.exports = {
    parser: '@typescript-eslint/parser',
    settings: {
        react: {
            version: 'detect'
        }
    },
    extends: [
        'plugin:react/all',
        'eslint:all'
    ],
    parserOptions: {
        jsx: true,
        useJSXTextNode: true,
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true
        },
        project: './tsconfig.json'
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'import',
        'babel',
        'local-rules'
    ],
    env: {
        browser: true,
        es6: true
    },
    rules: {
        'react/prefer-stateless-function': 0,
        'react/prefer-es6-class': 2,
        'react/jsx-one-expression-per-line': 0,
        'react/display-name': 0,
        'react/jsx-filename-extension': [
            1,
            { extensions: ['.tsx'] }
        ],
        'react/jsx-max-props-per-line': [
            1,
            { maximum: 3 }
        ],
        'react/jsx-no-literals': 0,
        'react/destructuring-assignment': 0,
        'react/no-set-state': 0,

        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
        'import/order': [
            2,
            {
                groups: [
                    'builtin',
                    'external',
                    'sibling',
                    'parent',
                    'index'
                ]
            }
        ],

        // https://github.com/babel/eslint-plugin-babel
        'babel/no-invalid-this': 1,

        // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
        'jsx-quotes': [
            1,
            'prefer-double'
        ],

        'semi': [
            2,
            'always',
            { 'omitLastInOneLineBlock': true }
        ],
        'semi-spacing': [
            2,
            {
                'before': false,
                'after': true
            }
        ],
        'wrap-iife': [
            2,
            'inside'
        ],
        'no-use-before-define': [
            2,
            'nofunc'
        ],
        'no-caller': 2,
        'no-cond-assign': 2,
        'no-constant-condition': 2,
        'no-confusing-arrow': 0,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty': [
            2,
            { 'allowEmptyCatch': true }
        ],
        'no-extra-boolean-cast': 2,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-new': 2,
        'no-sparse-arrays': 2,
        'no-unexpected-multiline': 2,
        'no-unreachable': 2,
        'no-unused-vars': [
            2,
            {
                'vars': 'all',
                'args': 'none'
            }
        ],
        'no-global-strict': 0,
        'no-continue': 0,
        'max-params': [
            2,
            5
        ],
        'max-depth': [
            2,
            4
        ],
        'no-eq-null': 0,
        'no-unused-expressions': 0,
        'dot-notation': 0,
        'use-isnan': 2,
        'no-ternary': 0,
        'no-magic-numbers': 0,
        'multiline-ternary': 0,
        'object-property-newline': 0,
        'sort-imports': 0,
        'sort-keys': 0,
        'no-process-env': 0,
        'no-extra-parens': [
            2,
            'all',
            { 'ignoreJSX': 'all' }
        ],
        'no-invalid-this': 0,
        'max-statements': 0,
        'id-length': 0,

        // Codestyle
        'array-bracket-spacing': [
            2,
            'never'
        ],
        'brace-style': [
            2,
            '1tbs',
            { 'allowSingleLine': true }
        ],
        'camelcase': [
            2,
            { 'properties': 'never' }
        ],
        'comma-dangle': [
            2,
            'never'
        ],
        'comma-spacing': [
            2,
            {
                'before': false,
                'after': true
            }
        ],
        'eol-last': 2,
        'func-call-spacing': 2,
        'keyword-spacing': [
            2,
            {
                'before': true,
                'after': true
            }
        ],
        'max-len': [
            2,
            {
                code: 120,
                ignoreStrings: true,
                ignoreComments: true
            }
        ],
        'no-lonely-if': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multiple-empty-lines': 2,
        'no-trailing-spaces': 2,
        'no-unneeded-ternary': 2,
        'object-curly-spacing': [
            2,
            'always'
        ],
        'one-var-declaration-per-line': [
            2,
            'initializations'
        ],
        'one-var': [
            2,
            'never'
        ],
        'operator-linebreak': [
            2,
            'after'
        ],
        'padded-blocks': [
            2,
            'never'
        ],
        'quote-props': [
            2,
            'as-needed',
            {
                unnecessary: true,
                keywords: true
            }
        ],
        'quotes': [
            2,
            'single',
            { 'avoidEscape': true }
        ],
        'space-before-blocks': [
            2,
            'always'
        ],
        'space-in-parens': 2,
        'no-console': [
            2,
            {
                allow: [
                    'assert',
                    'error',
                    'warn'
                ]
            }
        ],
        'key-spacing': [
            2,
            {
                'beforeColon': false,
                'afterColon': true,
                'mode': 'strict'
            }
        ],
        'space-infix-ops': 2,
        'indent': [
            1,
            4,
            { 'SwitchCase': 1 }
        ],
        'arrow-body-style': [
            1,
            'as-needed'
        ],
        'arrow-parens': [
            1,
            'as-needed'
        ],
        'arrow-spacing': 1,
        'space-before-function-paren': [
            1,
            'never'
        ],
        'func-style': 0,

        // Best practices
        'block-scoped-var': 2,
        'complexity': 2,
        'curly': [
            2,
            'all'
        ],
        'eqeqeq': [
            2,
            'always',
            { 'null': 'ignore' }
        ],
        'no-else-return': 2,
        'no-extra-bind': 2,
        'no-return-assign': 0,
        'yoda': 2,
        'dot-location': [2, 'property'],

        'local-rules/no-async': 2,
        'local-rules/no-undefined-window': 2
    },
    overrides: [
        {
            files: ['components/**/*.tsx'],
            rules: {
                'local-rules/correct-file-export': 2
            }
        },
        {
            files: [
                '**/*.tsx',
                '**/*.ts'
            ],
            rules: {
                // https://github.com/bradzacher/eslint-plugin-typescript#supported-rules
                '@typescript-eslint/adjacent-overload-signatures': 2,
                '@typescript-eslint/array-type': 2,
                '@typescript-eslint/ban-types': 2,
                '@typescript-eslint/camelcase': 2,
                '@typescript-eslint/class-name-casing': 2,
                '@typescript-eslint/explicit-function-return-type': 2,
                '@typescript-eslint/explicit-member-accessibility': 2,
                '@typescript-eslint/indent': 2,
                '@typescript-eslint/interface-name-prefix': [2, 'always'],
                '@typescript-eslint/member-delimiter-style': 2,
                '@typescript-eslint/no-array-constructor': 2,
                '@typescript-eslint/no-inferrable-types': 2,
                '@typescript-eslint/no-misused-new': 2,
                '@typescript-eslint/no-namespace': 2,
                '@typescript-eslint/no-non-null-assertion': 2,
                '@typescript-eslint/no-object-literal-type-assertion': 2,
                '@typescript-eslint/no-parameter-properties': 2,
                '@typescript-eslint/no-triple-slash-reference': 2,
                '@typescript-eslint/no-use-before-define': 2,
                '@typescript-eslint/no-var-requires': 2,
                '@typescript-eslint/prefer-interface': 2,
                '@typescript-eslint/prefer-namespace-keyword': 2,
                '@typescript-eslint/type-annotation-spacing': 2,
                '@typescript-eslint/no-unused-vars': 2,
                '@typescript-eslint/no-explicit-any': 2,
                '@typescript-eslint/no-empty-interface': 2,
                '@typescript-eslint/no-angle-bracket-type-assertion': 2,
                '@typescript-eslint/generic-type-naming': 2,
                '@typescript-eslint/member-naming': 2,
                '@typescript-eslint/member-ordering': 2,
                '@typescript-eslint/no-extraneous-class': 2,
                '@typescript-eslint/no-for-in-array': 2,
                '@typescript-eslint/no-this-alias': 2,
                '@typescript-eslint/no-type-alias': 2,
                '@typescript-eslint/no-unnecessary-qualifier': 2,
                '@typescript-eslint/no-unnecessary-type-assertion': 2,
                '@typescript-eslint/no-useless-constructor': 2,
                '@typescript-eslint/prefer-function-type': 2,
                '@typescript-eslint/restrict-plus-operands': 2
            }
        },
        {
            files: [
                'webpack.config.js',
                'server/**/*.*',
                'tools/**/*.*',
                'postcss.config.js',
                'lints/**/*.*',
                'eslint-local-rules.js'
            ],
            env: {
                node: true
            }
        }
    ]
};
