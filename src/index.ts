import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpush from './webpushConfig';

import { subscribe, renew, remove, broadcast } from './subscriptionController';

const app = express();

// Serve all files in client
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/subscription', subscribe);
app.patch('/subscription', renew);
app.delete('/subscription', remove);
app.post('/broadcast', broadcast);

webpush();

// start the Express server
app.listen(process.env.PORT || 3000, () => {
	console.log(`server started at http://localhost:${3000}`);
});
