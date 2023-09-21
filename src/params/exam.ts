import type { ParamMatcher } from '@sveltejs/kit';

import { ExamType } from '@prisma/client';

export const match = ((param) => {
	return (Object.values(ExamType) as string[]).includes(param.toLowerCase());
	// return /^\d+$/.test(param);
}) satisfies ParamMatcher;
