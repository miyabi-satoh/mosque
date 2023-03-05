import { prisma } from './prisma';

export const existsUsername = async (username: string, id?: number) => {
	if (!username) {
		return false;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			username
		}
	});
	return !!ret;
};

export const existsAbbrev = async (abbrev: string, id?: number) => {
	if (!abbrev) {
		return false;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			abbrev
		}
	});
	return !!ret;
};
