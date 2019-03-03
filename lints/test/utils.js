const getCreateSuite = (createErrorMessage, opts = {}) => (code, ...errVarsNames) => ({
    code,
    errors: errVarsNames.map(createErrorMessage),
    env: { browser: true },
    parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    ...opts
});

module.exports = { getCreateSuite };
