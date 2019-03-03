const precss = require('precss');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssAutomath = require('postcss-automath');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const csswring = require('csswring');
const postcssScss = require('postcss-scss');

const browsers = [
    'android 4',
    'ios 9',
    'ie 11'
];

const plugins = [
    precss(),
    postcssImport(),
    postcssNested,
    postcssAutomath(),
    postcssUrl({ url: 'inline' }),
    autoprefixer({ browsers }),
    postcssReporter(),
    csswring()
];

module.exports = {
    plugins,
    parser: postcssScss
};
