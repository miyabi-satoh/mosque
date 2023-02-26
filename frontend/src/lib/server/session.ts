import type { Cookies } from '@sveltejs/kit';
import { prisma } from './prisma';
import { COOKIE_SESSION } from '$lib/constants';

export const getUser = async (cookies: Cookies) => {
	const session = cookies.get(COOKIE_SESSION);
	if (session) {
		const user = await prisma.user.findFirst({
			where: {
				token: session
			}
		});
		return user;
	}
	return null;
};
