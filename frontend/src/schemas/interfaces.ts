// npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/models/strapi_schemas.ts

export interface IStrapiQuery {
	sort?: string;
	'pagination[withCount]'?: boolean;
	'pagination[page]'?: number;
	'pagination[pageSize]'?: number;
	'pagination[start]'?: number;
	'pagination[limit]'?: number;
	fields?: string;
	populate?: string;
	filters?: Record<string, never>;
	locale?: string;
}

export interface IPageMeta {
	title: string;
	description?: string | undefined;
	content?: string | undefined;
}

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

export interface IBreadcrumbItemParam {
	href: string;
	name: string;
}
