import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	const examType = param.toLowerCase();
	// const examType = param.toLowerCase() as ExamTypeEnum;
	return examType === 'ctest' || examType === 'eiken' || examType === 'kyote';
}) satisfies ParamMatcher;
