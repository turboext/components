const noAsync = require('./rules/no-async');
const noUndefinedWindow = require('./rules/no-undefined-window');
const correctFileExport = require('./rules/correct-file-export');

module.exports = {
    'no-async': noAsync,
    'correct-file-export': correctFileExport,
    'no-undefined-window': noUndefinedWindow
};
