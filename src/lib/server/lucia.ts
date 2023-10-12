import { prisma } from '@lucia-auth/adapter-prisma';
import type { User } from '@prisma/client';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import 'lucia/polyfill/node';

import {
	ACTIVE_PERIOD_MINUTES,
	ADMIN_NAME,
	ADMIN_PASS,
	IDLE_PERIOD_MINUTES
} from '$env/static/private';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

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
			if (data.fullName) {
				return data.fullName;
			}
			return data.username;
		})(data);

		const attributes = exclude(data, ['id']);
		return {
			...attributes,
			displayName
		};
	}
});

export type Auth = typeof auth;

export const defaultUserAttributes: Omit<User, 'id'> = {
	username: '',
	role: 'USER',
	fullName: null,
	displayName: null,
	email: null,
	code: null,
	avatar: null
} as const;

// create built-in users
export async function createBuiltinUsers(): Promise<void> {
	const count = await db.user.count();
	if (count === 0) {
		const users: (Pick<User, 'username' | 'role'> & { password: string })[] = [
			{
				username: ADMIN_NAME,
				password: ADMIN_PASS,
				role: 'ADMIN'
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
					...defaultUserAttributes,
					username: user.username,
					fullName: user.username,
					role: user.role
				}
			});
		}
	}
}
