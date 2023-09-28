import { prisma } from '@lucia-auth/adapter-prisma';
import { UserRole } from '@prisma/client';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import 'lucia/polyfill/node';

import {
	ACTIVE_PERIOD_MINUTES,
	ADMIN_NAME,
	ADMIN_PASS,
	IDLE_PERIOD_MINUTES,
	STAFF_NAME,
	STAFF_PASS
} from '$env/static/private';

import { PROVIDERID_USERNAME } from '$lib/consts';
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
		const displayName = ((data) => {
			if (data.displayName) {
				return data.displayName;
			}
			if (data.sei || data.mei) {
				return `${data.sei} ${data.mei}`.trim();
			}
			return data.username;
		})(data);

		return {
			username: data.username,
			displayName,
			role: data.role
		};
	}
});

export type Auth = typeof auth;

// create built-in users
export async function createBuiltinUsers() {
	const count = await db.user.count();
	if (count === 0) {
		const users = [
			{
				username: ADMIN_NAME,
				password: ADMIN_PASS,
				role: UserRole.ADMIN
			},
			{
				username: STAFF_NAME,
				password: STAFF_PASS,
				role: UserRole.STAFF
			}
		];
		for (const user of users) {
			await auth.createUser({
				key: {
					providerId: PROVIDERID_USERNAME,
					providerUserId: user.username.toLowerCase(),
					password: user.password
				},
				attributes: {
					username: user.username,
					role: user.role,
					sei: null,
					mei: null,
					seiKana: null,
					meiKana: null,
					birthday: null,
					displayName: null
				}
			});
		}
	}
}
