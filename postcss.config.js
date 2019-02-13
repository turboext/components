'use strict';

const browsers = [
    'android 4',
    'ios 9',
    'ie 11'
];

const plugins = [
    require('precss')(),
    require('postcss-import')(),
    require('postcss-nested'),
    require('postcss-automath')(),
    require('postcss-url')({ url: 'inline' }),
    require('autoprefixer')({ browsers }),
    require('postcss-reporter')(),
    require('csswring')()
];

module.exports = {
    plugins,
    parser: require('postcss-scss')
};
