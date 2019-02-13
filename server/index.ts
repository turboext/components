import * as express from 'express';
import { Request, Response } from 'express';
import { readFileSync } from 'fs-extra';

import {createServer as createHttpsServer} from 'https';
import {createServer as createHttpServer} from 'http';

import router from './routes';

const app = express();

app.use('/', router);
app.use('/dist', express.static('dist'));

/* пишем ошибки в html, если где-то сломались */
app.use('*', (err: Error, req: Request, res: Response) => {
    const CODE_INTERNAL_ERROR = 500;

    res.writeHead(CODE_INTERNAL_ERROR, {
        'content-type': 'text/plain; charset=utf-8'
    });

    res.write(err.message);
    res.write(err.stack);
    res.end();
});

const httpServer = createHttpServer(app);
const httpsServer = createHttpsServer({
    key: readFileSync('keys/server.key', 'utf8'),
    cert: readFileSync('keys/server.crt', 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
}, app);

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;

// tslint:disable no-console
httpServer.listen(HTTP_PORT, () => {
    console.log('http server is listening on', HTTP_PORT);
});
httpsServer.listen(HTTPS_PORT, () => {
    console.log('https server is listening on', HTTPS_PORT);
});
