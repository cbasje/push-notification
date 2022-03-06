import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpush from './webpushConfig';

import { post, remove, broadcast } from './subscriptionController';

const app = express();
const port = 8080; // default port to listen

// Serve all files in client
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

app.post('/subscription', post);
app.delete('/subscription', remove);
app.get('/broadcast', broadcast);

webpush();

// start the Express server
app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
