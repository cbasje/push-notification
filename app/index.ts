import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpush from './webpushConfig';

import { post, remove, broadcast } from './subscriptionController';

const app = express();

// Serve all files in client
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

app.post('/subscription', post);
app.delete('/subscription', remove);
app.get('/broadcast', broadcast);

webpush();

// start the Express server
app.listen(process.env.PORT || 8080, () => {
	console.log(`server started at http://localhost:${8080}`);
});
