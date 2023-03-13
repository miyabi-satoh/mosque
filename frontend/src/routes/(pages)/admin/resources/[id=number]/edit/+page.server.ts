import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { resourcePublicFields, type ResourceUpdate } from '$lib/resource';
import { errorToResult, requestToObject } from '$lib/utils';
import { updateResource } from '$lib/server/resource';
import type { ActionResult } from '$lib/types';
import { MSG } from '$lib/constants';

export const load = (async ({ params, parent }) => {
	console.log(`/routes/(pages)/admin/resources/[id=number]/edit/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	const resource = await prisma.resource.findUnique({
		where: {
			id: Number(params.id)
		},
		select: resourcePublicFields
	});

	return {
		resource,
		pageMeta: {
			title: `リソース編集`
		},
		breadcrumbParams: [
			...breadcrumbParams,
			{
				name: `リソース編集`
			}
		]
	};
}) satisfies PageServerLoad;

type Result = ActionResult<ResourceUpdate>;

export const actions: Actions = {
	default: async ({ params, request }): Promise<Result> => {
		console.log(`POST /routes/(pages)/admin/resources/[id=number]/edit/+page.server.ts`);
		const id = Number(params.id);
		const formData: Result['formData'] = await requestToObject(request);

		try {
			const result = await updateResource(id, formData);
			return {
				success: true,
				formData,
				id: result.id
			};
		} catch (err) {
			const result = errorToResult(err, formData);
			if (result !== undefined) {
				return result;
			}
		}

		return { message: MSG.UKNOWN_ERROR, formData };
	}
};
