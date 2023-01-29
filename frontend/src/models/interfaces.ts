// npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/models/strapi_schemas.ts
import type { paths } from './strapi_schemas';

export type IStrapiPage =
	paths['/pages/{id}']['get']['responses']['200']['content']['application/json']['data'];
export type IStrapiLink =
	paths['/links/{id}']['get']['responses']['200']['content']['application/json']['data'];
export type IStrapiFormat =
	paths['/formats/{id}']['get']['responses']['200']['content']['application/json']['data'];

export interface IPage {
	id: number;
	url: string;
	title: string;
	description: string;
}

export interface ILink {
	id: number;
	url: string;
	title: string;
	description: string;
}

export interface IFormat {
	id: number;
	title: string;
	description: string;
	realPath: string;
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
