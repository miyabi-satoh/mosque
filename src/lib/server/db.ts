import { PrismaClient } from './prisma';

export const db = new PrismaClient();

export type PrismaInnerTransaction = Parameters<Parameters<typeof db.$transaction>[0]>[0];
