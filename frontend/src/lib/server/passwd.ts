import { compareSync, hashSync } from 'bcrypt';

export const encryptPassword = (password: string) => {
	if (password) {
		return hashSync(password, 10);
	}
	throw new Error('password is empty.');
};

export const comparePassword = (password1: string, password2: string) => {
	return compareSync(password1, password2);
};
