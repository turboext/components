// Handling only server-side async functions since browser one won't be called anyway
module.exports = new Map([
    [
        'setTimeout',
        true
    ],
    [
        'setInterval',
        true
    ],
    [
        'Promise',
        true
    ],
    [
        'import',
        true
    ]
]);
