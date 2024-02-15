import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { User, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Lucia, TimeSpan, generateId } from 'lucia';

// import { sveltekit } from 'lucia/middleware';
// import 'lucia/polyfill/node';
import { ACTIVE_PERIOD_MINUTES, ADMIN_NAME, ADMIN_PASS } from '$env/static/private';

import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

// import { dev } from '$app/environment';

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (data) => {
		const displayName = data.displayName || data.fullName || data.username;

		const attributes = exclude(data, ['id']);
		return {
			...attributes,
			displayName,
			userId: data.id
		};
	},
	sessionExpiresIn: new TimeSpan(Number(ACTIVE_PERIOD_MINUTES), 'm'),
	sessionCookie: {
		attributes: {
			secure: false
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

// interface DatabaseSessionAttributes {
// 	country: string;
// }
interface DatabaseUserAttributes {
	id: string;
	username: string;
	hashedPassword: string;
	role: UserRoleEnum;
	fullName: string | null;
	displayName: string | null;
	email: string | null;
	code: string | null;
	avatar: string | null;
	lastLoginAt: string | null;
}

// export type Auth = typeof lucia;

export const defaultUserAttributes: Omit<User, 'id' | 'hashedPassword'> = {
	username: '',
	role: 'USER',
	fullName: null,
	displayName: null,
	email: null,
	code: null,
	avatar: null,
	lastLoginAt: null
} as const;

export async function createUser(username: string, password: string, userData: Partial<User>) {
	try {
		const hashedPassword = await hashPassword(password);
		await db.user.create({
			data: {
				...defaultUserAttributes,
				...userData,
				hashedPassword,
				id: generateId(15),
				username: username.toLowerCase()
			}
		});
		return { success: true };
	} catch (error) {
		console.error('ユーザー作成中にエラーが発生しました:', error);
		return { success: false, error };
	}
}

export function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
	return bcrypt.compare(password, hash);
}

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
			await createUser(user.username, user.password, {
				fullName: user.username,
				role: user.role
			});
		}
	}
}
