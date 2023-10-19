import { PrismaClient } from './prisma';

export const db = new PrismaClient();

export type PrismaInnerTransaction = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export const getMessagesWithUser = (channelId: string) =>
	db.message.findMany({
		where: { channelId },
		orderBy: { createdAt: 'asc' },
		include: {
			user: {
				select: {
					displayName: true,
					fullName: true,
					avatar: true
				}
			}
		}
	});
