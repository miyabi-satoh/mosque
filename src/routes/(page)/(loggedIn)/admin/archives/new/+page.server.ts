import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { URLS } from '$lib/consts';
import { ArchiveSchema } from '$lib/schemas/zod';

import type { PageServerLoad } from './$types';

const schema = ArchiveSchema.extend({
	id: ArchiveSchema.shape.id.optional()
});

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: '作成',
		link: URLS.ADMIN_ARCHIVES('new')
	});

	const user = null;
	const form = await superValidate(user, zod(schema));
	return { form };
}) satisfies PageServerLoad;
