import { prisma } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

import { dev } from '$app/environment';

import { db } from '$lib/server/db';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(db),

	getUserAttributes: (data) => {
		return {
			username: data.username,
			role: data.role
		};
	}
});

export type Auth = typeof auth;
