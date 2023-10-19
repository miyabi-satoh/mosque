import type { Channel, Message, Prisma, User } from '@prisma/client';

import { PrismaClient } from './prisma';

export const db = new PrismaClient();

export type PrismaInnerTransaction = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export type MessageWithUser = Message & {
	user: Pick<User, 'displayName' | 'fullName' | 'avatar'>;
};
export type ChannelWithLastMessage = Channel & {
	lastMessage?: MessageWithUser | null;
};

export const getMessagesWithUser = (args: Prisma.MessageFindManyArgs) =>
	db.message.findMany({
		orderBy: { createdAt: 'asc' },
		include: {
			user: {
				select: {
					displayName: true,
					fullName: true,
					avatar: true
				}
			}
		},
		...args
	}) as Prisma.PrismaPromise<MessageWithUser[]>;
