// npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/models/strapi_schemas.ts
import type { paths } from './strapi_schemas';

type Primitive = number | string | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line @typescript-eslint/ban-types
type Builtin = Primitive | Function | Date | Error | RegExp;

type DeepNonNullable<T> = T extends Builtin
	? NonNullable<T>
	: { [key in keyof T]-?: DeepNonNullable<T[key]> };

type IStrapiPageBase =
	paths['/pages/{id}']['get']['responses']['200']['content']['application/json']['data'];
type IStrapiLinkBase =
	paths['/links/{id}']['get']['responses']['200']['content']['application/json']['data'];
type IStrapiFormatBase =
	paths['/formats/{id}']['get']['responses']['200']['content']['application/json']['data'];
type IStrapiResourceBase =
	paths['/resources/{id}']['get']['responses']['200']['content']['application/json']['data'];
type IStrapiMimeBase =
	paths['/mimes/{id}']['get']['responses']['200']['content']['application/json']['data'];
type IStrapiInfoBase =
	paths['/infos/{id}']['get']['responses']['200']['content']['application/json']['data'];

export type IStrapiPage = DeepNonNullable<IStrapiPageBase>;
export type IStrapiLink = DeepNonNullable<IStrapiLinkBase>;
export type IStrapiFormat = DeepNonNullable<IStrapiFormatBase>;
export type IStrapiResource = DeepNonNullable<IStrapiResourceBase>;
export type IStrapiMime = DeepNonNullable<IStrapiMimeBase>;
export type IStrapiInfo = DeepNonNullable<IStrapiInfoBase>;
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
