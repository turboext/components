const chokidar = require('chokidar');
const spawn = require('cross-spawn');

const watcher = chokidar.watch('components/*', { ignoreInitial: true });
const buildRegistry = () => spawn('npm', ['run', 'build:registry'], { stdio: 'inherit' });

watcher
    .on('addDir', buildRegistry)
    .on('unlinkDir', buildRegistry);
