// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}
	// namespace Lucia {
	// 	type Auth = import('$lib/server/lucia').Auth;
	// 	type DatabaseUserAttributes = Omit<import('@prisma/client').User, 'id'>;
	// 	type DatabaseSessionAttributes = Record<string, never>;
	// }
}

export {};
