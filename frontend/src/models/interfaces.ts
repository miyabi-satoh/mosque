// npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/models/strapi_schemas.ts
import type { paths } from './strapi_schemas';

type Primitive = number | string | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line @typescript-eslint/ban-types
type Builtin = Primitive | Function | Date | Error | RegExp;

type DeepNonNullable<T> = T extends Builtin
	? NonNullable<T>
	: { [key in keyof T]-?: DeepNonNullable<T[key]> };

export type IStrapiPage = DeepNonNullable<
	paths['/pages/{id}']['get']['responses']['200']['content']['application/json']['data']
>;
export type IStrapiPageListResponse = DeepNonNullable<
	paths['/pages']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiLinksQuery = Partial<
	DeepNonNullable<paths['/links']['get']['parameters']>['query']
>;
export type IStrapiFormat = DeepNonNullable<
	paths['/formats/{id}']['get']['responses']['200']['content']['application/json']['data']
>;
export type IStrapiResource = DeepNonNullable<
	paths['/resources/{id}']['get']['responses']['200']['content']['application/json']['data']
>;
export type IStrapiMime = DeepNonNullable<
	paths['/mimes/{id}']['get']['responses']['200']['content']['application/json']['data']
>;
export type IStrapiInfo = DeepNonNullable<
	paths['/infos/{id}']['get']['responses']['200']['content']['application/json']['data']
>;

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

export type BlobType = 'text' | 'img' | 'audio' | 'video' | 'pdf' | 'unknown' | 'error';
