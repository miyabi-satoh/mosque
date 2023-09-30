import { ExamType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const ctest = await prisma.exam.upsert({
		where: {
			examType: ExamType.ctest
		},
		update: {
			shortName: 'Ｃテスト',
			fullName: 'Ｃテスト'
		},
		create: {
			examType: ExamType.ctest,
			shortName: 'Ｃテスト',
			fullName: 'Ｃテスト',
			sortOrder: 1,
			labelGrade: '学年',
			labelNumOf: '月号'
		}
	});
	const eiken = await prisma.exam.upsert({
		where: {
			examType: ExamType.eiken
		},
		update: {
			shortName: '英検',
			fullName: '英検'
		},
		create: {
			examType: ExamType.eiken,
			shortName: '英検',
			fullName: '英検',
			sortOrder: 2,
			labelGrade: '級',
			labelNumOf: '実施回'
		}
	});
	const kyote = await prisma.exam.upsert({
		where: {
			examType: ExamType.kyote
		},
		update: {},
		create: {
			examType: ExamType.kyote,
			shortName: '共テ模試',
			fullName: '共通テスト模試',
			sortOrder: 3,
			labelGrade: '',
			labelNumOf: ''
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
