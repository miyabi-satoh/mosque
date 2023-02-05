// npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/models/strapi_schemas.ts
import type { paths } from './strapi_schemas';

type Primitive = number | string | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line @typescript-eslint/ban-types
type Builtin = Primitive | Function | Date | Error | RegExp;

type DeepNonNullable<T> = T extends Builtin
	? NonNullable<T>
	: { [key in keyof T]-?: DeepNonNullable<T[key]> };

export type IStrapiPageResponse = DeepNonNullable<
	paths['/pages/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiPageListResponse = DeepNonNullable<
	paths['/pages']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiPageQuery = Partial<
	DeepNonNullable<paths['/pages']['get']['parameters']>['query']
>;

export type IStrapiLinkResponse = DeepNonNullable<
	paths['/links/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiLinkListResponse = DeepNonNullable<
	paths['/links']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiLinkQuery = Partial<
	DeepNonNullable<paths['/links']['get']['parameters']>['query']
>;

export type IStrapiFormatResponse = DeepNonNullable<
	paths['/formats/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiFormatListResponse = DeepNonNullable<
	paths['/formats']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiFormatQuery = Partial<
	DeepNonNullable<paths['/formats']['get']['parameters']>['query']
>;

export type IStrapiResourceResponse = DeepNonNullable<
	paths['/resources/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiResourceListResponse = DeepNonNullable<
	paths['/resources']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiResourceQuery = Partial<
	DeepNonNullable<paths['/resources']['get']['parameters']>['query']
>;

export type IStrapiMimeResponse = DeepNonNullable<
	paths['/mimes/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiMimeListResponse = DeepNonNullable<
	paths['/mimes']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiMimeQuery = Partial<
	DeepNonNullable<paths['/mimes']['get']['parameters']>['query']
>;

export type IStrapiInfoResponse = DeepNonNullable<
	paths['/infos/{id}']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiInfoListResponse = DeepNonNullable<
	paths['/infos']['get']['responses']['200']['content']['application/json']
>;
export type IStrapiInfoQuery = Partial<
	DeepNonNullable<paths['/infos']['get']['parameters']>['query']
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
