const enum Events {
    load = 'load',
    resize = 'resize',
    error = 'error'
}

function listen(type: Events, id, callback);
function unlisten(type: Events);
function send(type: Events, id, payload);
