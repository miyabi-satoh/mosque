import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const ctest = await prisma.exam.upsert({
		where: {
			examType: 'ctest'
		},
		update: {},
		create: {
			examType: 'ctest',
			name: 'Ｃテスト',
			sortOrder: 1
		}
	});
	const eiken = await prisma.exam.upsert({
		where: {
			examType: 'eiken'
		},
		update: {},
		create: {
			examType: 'eiken',
			name: '英検',
			sortOrder: 2
		}
	});
	const kyote = await prisma.exam.upsert({
		where: {
			examType: 'kyote'
		},
		update: {},
		create: {
			examType: 'kyote',
			name: '共テ模試',
			sortOrder: 3
		}
	});

	console.log({ ctest, eiken, kyote });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
