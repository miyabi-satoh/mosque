// npx openapi-typescript src/extensions/documentation/documentation/1.0.0/full_documentation.json --output ../frontend/src/lib/strapi_schemas.ts
import type { components } from '../models/strapi_models';

export type IPage = components['schemas']['PageListResponseDataItem'];

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
