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
	namespace svelteHTML {
		type Item = import('svelte-dnd-action').Item;
		type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
		interface HTMLAttributes<T> {
			'on:consider'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
			'on:finalize'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
		}
	}
}

export {};
