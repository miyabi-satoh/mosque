import { compareSync, hashSync } from 'bcrypt';

export const encryptPassword = (password: string) => {
	return hashSync(password, 10);
};

export const comparePassword = (password1: string | null, password2: string | null) => {
	if (password1 && password2) {
		return compareSync(password1, password2);
	}
	return false;
};
