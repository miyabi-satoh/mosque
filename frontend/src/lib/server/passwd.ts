import { compareSync, hashSync } from 'bcrypt';

export const encryptPassword = (password: string | null | undefined) => {
	if (password) {
		return hashSync(password, 10);
	}
	console.log(`encryptPassword: ${password}`);
	throw new Error(`Throws error from encryptPassword.`);
};

export const comparePassword = (password1: string | null, password2: string | null) => {
	if (password1 && password2) {
		return compareSync(password1, password2);
	}
	return false;
};
