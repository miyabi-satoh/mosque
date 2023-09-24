import { prisma } from '@lucia-auth/adapter-prisma';
import { UserRole } from '@prisma/client';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

import {
	ACTIVE_PERIOD_MINUTES,
	ADMIN_NAME,
	ADMIN_PASS,
	IDLE_PERIOD_MINUTES,
	STAFF_NAME,
	STAFF_PASS
} from '$env/static/private';

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

// ビルトインユーザーを作成
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
					providerId: 'username',
					providerUserId: user.username.toLowerCase(),
					password: user.password
				},
				attributes: {
					username: user.username,
					role: user.role
				}
			});
		}
	}
}
