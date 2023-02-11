import { apiUrl } from './utils';
import type { Fetch, IUserProfile } from '$schemas';

function authHeaders(token: string) {
	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}

export const apiAuth = {
	async getAccessToken(fetch: Fetch, username: string, password: string): Promise<string> {
		const params = new URLSearchParams();
		params.append('username', username);
		params.append('password', password);

		const res = await fetch(apiUrl(`login/access-token`), {
			method: 'POST',
			body: params
		});
		if (res.ok) {
			const json = await res.json();
			return json.access_token;
		}
		return '';
	},

	async getMe(fetch: Fetch, token: string): Promise<IUserProfile> {
		const res = await fetch(apiUrl(`users/me`), authHeaders(token));
		if (res.ok) {
			const json = await res.json();
			return json;
		}
		throw new Error('apiAuth.getMe');
	}
};
