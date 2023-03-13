import type { Resource } from '@prisma/client';

type PickupField = 'id' | 'title' | 'description';
export type ResourceUpdate = Partial<Pick<Resource, PickupField>>;

export const resourcePublicFields = {
	id: true,
	title: true,
	description: true
} as const;
