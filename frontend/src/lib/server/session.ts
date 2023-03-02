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

export const isAdminSession = async (cookies: Cookies) => {
	const user = await getUser(cookies);
	return user && user.id == 1;
};
