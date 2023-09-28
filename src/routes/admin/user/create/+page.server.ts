import { fail } from '@sveltejs/kit';

import { UserRole, type User } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { format } from 'date-fns';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	csv: z.string().min(1, `入力してください`)
});
const csvHeader = ['code', 'name', 'kana', 'birthday'].join(',') + '\n';
type CsvT = {
	code: string;
	name: string;
	kana: string;
	birthday: string;
};
type UserPropT = Pick<User, 'birthday' | 'mei' | 'meiKana' | 'sei' | 'seiKana' | 'username'>;

export const load = (async () => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		form.data.csv = toZenKata(
			form.data.csv.replace(/[ぁ-ん]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0x60))
		);

		try {
			const staffArray: CsvT[] = parse(csvHeader + form.data.csv.replaceAll('\r', ''), {
				skipEmptyLines: true,
				columns: true
			});
			const users: UserPropT[] = staffArray.map((data) => {
				const [sei, mei] = ((src: string) =>
					src.includes('　') ? src.split('　') : src.split(' '))(data.name);
				const [seiKana, meiKana] = ((src: string) => {
					// 全角カタカナに統一
					src = toZenKata(
						src.replace(/[ぁ-ん]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0x60))
					);
					return src.includes('　') ? src.split('　') : src.split(' ');
				})(data.kana);

				return {
					username: data.code,
					sei,
					mei,
					seiKana,
					meiKana,
					birthday: new Date(data.birthday)
				} satisfies UserPropT;
			});
			let count = 0;
			for (const user of users) {
				const found = await db.user.findFirst({
					where: {
						sei: user.sei,
						mei: user.mei,
						seiKana: user.seiKana,
						meiKana: user.meiKana,
						birthday: user.birthday
					}
				});
				if (!found) {
					await auth.createUser({
						key: {
							providerId: PROVIDERID_USERNAME,
							providerUserId: user.username.toLowerCase(),
							password: format(user.birthday!, 'yyyyMMdd')
						},
						attributes: {
							...user,
							role: UserRole.STAFF,
							displayName: null
						}
					});
					count++;
				}
			}

			return message(form, `${count}件のアカウントを作成しました。`);
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'エラー' } });
		}
	}
};

const toZenKata = (() => {
	//muddy
	const D_MUD = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ';
	const S_MUD = 'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ';
	//kiyone
	const D_KIY =
		'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ' +
		'マミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・';
	const S_KIY = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･';

	return (str: string) => {
		for (let i = 0, len = D_MUD.length; i < len; i++) {
			str = str.split(S_MUD.slice(i * 2, i * 2 + 2)).join(D_MUD.slice(i, i + 1));
		}
		for (let i = 0, len = D_KIY.length; i < len; i++) {
			str = str.split(S_KIY.slice(i, i + 1)).join(D_KIY.slice(i, i + 1));
		}
		return str;
	};
})();
