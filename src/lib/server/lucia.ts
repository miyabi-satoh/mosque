import { prisma } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

import { ACTIVE_PERIOD_MINUTES, IDLE_PERIOD_MINUTES } from '$env/static/private';

import { db } from '$lib/server/db';

// import { dev } from '$app/environment';

export const auth = lucia({
	// env: dev ? 'DEV' : 'PROD',
	env: 'DEV',
	middleware: sveltekit(),
	adapter: prisma(db),
	sessionExpiresIn: {
		activePeriod: 1000 * 60 * Number(ACTIVE_PERIOD_MINUTES),
		idlePeriod: 1000 * 60 * Number(IDLE_PERIOD_MINUTES)
	},

	getUserAttributes: (data) => {
		return {
			username: data.username,
			role: data.role
		};
	}
});

export type Auth = typeof auth;
