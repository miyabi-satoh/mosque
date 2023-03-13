export type BreadcrumbParamType = {
	name: string;
	href: string;
};

export type Fetch = typeof fetch;

export type Impartial<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type PostErros<T> = {
	[K in keyof T]?: string;
};
export type ActionResult<T, U = PostErros<T>> = {
	success?: boolean;
	message?: string;
	formData: Impartial<Required<Omit<T, 'id'>>>;
	errors?: U;
	id?: number;
};
