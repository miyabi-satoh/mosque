import { fail } from '@sveltejs/kit';

import { parse } from 'csv-parse/sync';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	csv: z.string().min(1, `入力してください`)
});
const header = ['id', 'name', 'kana'].join(',') + '\n';
type CsvT = {
	id: string;
	name: string;
	kana: string;
};

export const load = (async () => {
	const staff = await db.staff.findMany({
		orderBy: { id: 'asc' }
	});
	const csv = staff.map((s) => `${s.id},${s.sei} ${s.mei},${s.seiKana} ${s.meiKana}`).join('\n');
	const form = await superValidate({ csv }, schema);

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const staffArray = parse(header + form.data.csv.replaceAll('\r', ''), {
				skipEmptyLines: true,
				columns: true
			});
			console.log(staffArray);
			const staffData = staffArray.map((data: CsvT) => {
				const [sei, mei] = ((src: string) =>
					src.includes('　') ? src.split('　') : src.split(' '))(data.name);
				const [seiKana, meiKana] = ((src: string) => {
					// ひらがな -> 全角カタカナ
					src = src.replace(/[ぁ-ん]/g, function (s) {
						return String.fromCharCode(s.charCodeAt(0) + 0x60);
					});
					// 半角カタカナ -> 全角カタカナ
					src = toZenKata(src);
					return src.includes('　') ? src.split('　') : src.split(' ');
				})(data.kana);

				return {
					id: data.id,
					sei,
					mei,
					seiKana,
					meiKana
				};
			});

			await db.staff.deleteMany();
			await db.staff.createMany({ data: staffData });

			return message(form, '作成しました。');
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'エラー' } });
		}
	}
};

//muddy
const D_MUD = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ';
const S_MUD = 'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ';
//kiyone
const D_KIY =
	'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ' +
	'マミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・';
const S_KIY = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･';

const toZenKata = (str: string) => {
	for (let i = 0, len = D_MUD.length; i < len; i++) {
		str = str.split(S_MUD.slice(i * 2, i * 2 + 2)).join(D_MUD.slice(i, i + 1));
	}
	for (let i = 0, len = D_KIY.length; i < len; i++) {
		str = str.split(S_KIY.slice(i, i + 1)).join(D_KIY.slice(i, i + 1));
	}
	return str;
};
