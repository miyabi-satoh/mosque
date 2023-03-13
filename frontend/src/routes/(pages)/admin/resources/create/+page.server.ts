import type { Actions, PageServerLoad } from './$types';
import { errorToResult, requestToObject } from '$lib/utils';
import type { ResourceUpdate } from '$lib/resource';
import { createResource } from '$lib/server/resource';
import type { ActionResult } from '$lib/types';
import { MSG } from '$lib/constants';
import { prisma } from '$lib/server/prisma';

export const load = (async () => {
	const assets = await prisma.asset.findMany({
		orderBy: {
			updatedAt: 'desc'
		},
		select: {
			id: true,
			title: true
		}
	});

	return {
		assets
	};
}) satisfies PageServerLoad;

type Result = ActionResult<ResourceUpdate>;

export const actions: Actions = {
	default: async ({ request }): Promise<Result> => {
		console.log(`POST /routes/(pages)/admin/resources/create/+page.server.ts`);
		const formData: Result['formData'] = await requestToObject(request);

		try {
			const result = await createResource(formData);
			return {
				success: true,
				formData,
				id: result.id
			};
		} catch (err) {
			const result = errorToResult<ResourceUpdate>(err, formData);
			if (result !== undefined) {
				return result;
			}
		}

		return { message: MSG.UKNOWN_ERROR, formData };
	}
};
