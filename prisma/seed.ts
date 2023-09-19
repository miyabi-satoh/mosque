import { ExamType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const ctest = await prisma.exam.upsert({
		where: {
			examType: ExamType.ctest
		},
		update: {},
		create: {
			examType: ExamType.ctest,
			shortName: 'Cテスト',
			fullName: 'コンピュータテスト',
			sortOrder: 1,
			labelGrade: '学年',
			labelNumOf: '月号'
		}
	});
	const eiken = await prisma.exam.upsert({
		where: {
			examType: ExamType.eiken
		},
		update: {},
		create: {
			examType: ExamType.eiken,
			shortName: '英検',
			fullName: '実用英語技能検定',
			sortOrder: 2,
			labelGrade: '級',
			labelNumOf: '実施回'
		}
	});
	console.log({ ctest, eiken });
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
