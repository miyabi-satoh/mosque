import { sveltekit } from '@sveltejs/kit/vite';

import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';

import { WS_EVENT_MESSAGEUPDATED } from './src/lib/consts';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);
		io.on('connection', (socket) => {
			socket.on(WS_EVENT_MESSAGEUPDATED, (channelId) => {
				io.emit(WS_EVENT_MESSAGEUPDATED, channelId);
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true
	}
});
