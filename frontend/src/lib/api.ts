import axios from 'axios';
import type { IUserProfile } from './interfaces';

function authHeaders(token: string) {
	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}

export const api = {
	async getAccessToken(username: string, password: string) {
		const params = new URLSearchParams();
		params.append('username', username);
		params.append('password', password);

		return axios.post(`/api/v1/login/access-token`, params);
	},

	async getMe(token: string) {
		return axios.get<IUserProfile>(`/api/v1/users/me`, authHeaders(token));
	}
};
