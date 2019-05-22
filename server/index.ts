import { createServer as createHttpServer } from 'http';
import * as express from 'express';

import router from './routes';

const app = express();

app.use('/', router);
app.use('/dist', express.static('dist'));

const httpServer = createHttpServer(app);

const HTTP_PORT = 8081;

/* eslint-disable no-console */
httpServer.listen(HTTP_PORT, () => {
    console.log('http server is listening on', HTTP_PORT);
});
