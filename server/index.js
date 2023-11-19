import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { env } from '../build/env.js';
import { handler } from '../build/handler.js';

const path = env('SOCKET_PATH', false);
const host = env('HOST', '0.0.0.0');
const port = env('PORT', !path && '3000');

// const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
	socket.on('eventMessageUpdated', (channelId) => {
		io.emit('eventMessageUpdated', channelId);
	});
});

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler);

// server.listen(port, host);
server.listen({ path, host, port }, () => {
	console.log(`Listening on ${path ? path : host + ':' + port}`);
});
