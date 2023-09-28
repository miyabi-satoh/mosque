// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="lucia" />

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = Omit<import('@prisma/client').User, 'id'>;
		// type DatabaseUserAttributes = {
		// 	username: string;
		// 	role: import('@prisma/client').UserRole;
		// 	sei?: string;
		// 	mei?: string;
		// 	seiKana?: string;
		// 	meiKana?: string;
		// 	displayName?: string;
		// };
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
