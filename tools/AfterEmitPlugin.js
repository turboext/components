const chalk = require('chalk');

module.exports = () => {
    return {
        apply: compiler => {
            compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
                setTimeout(() => {
                    // eslint-disable-next-line no-console
                    console.log('Dev server запущен:');
                    // eslint-disable-next-line no-console
                    console.log(`${chalk.underline('http://localhost:8081')}`);
                }, 0);
            });
        }
    };
};
