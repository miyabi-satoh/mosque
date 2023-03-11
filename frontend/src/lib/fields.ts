import type { UserCreate } from './user';

type FieldType = {
	name: string;
	label: string;
	minlength?: number;
	maxlength?: number;
	helperText?: string;
};

export const fields = {
	user: {
		username: {
			name: 'username',
			label: 'ユーザー名',
			minlength: 4,
			maxlength: 20,
			helperText: '(半角英数字4〜20文字)'
		},
		password: {
			name: 'password',
			label: 'パスワード',
			minlength: 4,
			helperText: '(半角英数字4文字以上)'
		},
		displayName: {
			name: 'displayName',
			label: '表示名',
			maxlength: 5,
			helperText: '(5文字以内)'
		},
		abbrev: {
			name: 'abbrev',
			label: '略称',
			maxlength: 5,
			helperText: '(5文字以内)'
		},
		sei: { name: 'sei', label: '姓' },
		mei: { name: 'mei', label: '名' },
		seiKana: { name: 'seiKana', label: '姓(ふりがな)' },
		meiKana: { name: 'meiKana', label: '名(ふりがな)' },
		blocked: { name: 'blocked', label: '使用不可' },
		type: { name: 'type', label: '種別' }
	} satisfies {
		[K in keyof UserCreate]: FieldType;
	},

	passwd: {
		currentPassword: {
			name: 'currentPassword',
			label: '現在のパスワード'
		},
		newPassword: {
			name: 'newPassword',
			label: '新しいパスワード',
			minlength: 4,
			helperText: '(半角英数字4文字以上)'
		},
		confirmPassword: {
			name: 'confirmPassword',
			label: '新しいパスワード(確認用)'
		}
	} satisfies {
		[K: string]: FieldType;
	}
} as const;
