// Using default eslint globals library
const globals = require('globals');

// Any window global variable is disallowed
const forbidden = new Map(Object.entries(globals.browser));

// Except those are exists in both nodejs and window environments (like console)
const allowed = Object.keys(globals.node);
allowed.forEach(g => forbidden.delete(g));

/** Set of globals to search to search */
module.exports = forbidden;
