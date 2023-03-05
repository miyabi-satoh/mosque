export type BreadcrumbParamType = {
	name: string;
	href: string;
};

export type Fetch = typeof fetch;

export type Impartial<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};
