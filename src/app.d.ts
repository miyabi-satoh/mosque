// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="lucia" />

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = Omit<import('@prisma/client').User, 'id'>;
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
