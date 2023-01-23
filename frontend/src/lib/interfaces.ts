export interface IUserProfile {
	email: string;
	is_active: boolean;
	is_superuser: boolean;
	id: number;
}

export interface IUserProfileUpdate {
	email?: string;
	password?: string;
	is_active?: boolean;
	is_superuser?: boolean;
}

export interface IUserProfileCreate {
	email: string;
	password?: string;
	is_active?: boolean;
	is_superuser?: boolean;
}
