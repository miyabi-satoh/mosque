export function getLocalToken() {
	return localStorage.getItem('token');
}

export function saveLocalToken(token: string) {
	return localStorage.setItem('token', token);
}

export function removeLocalToken() {
	return localStorage.removeItem('token');
}

export function apiUrl(url: string) {
	return `//localhost/api/v1/${url}`;
}
