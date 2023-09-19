export type MediaT = {
	path: string;
};

export type CTestMediaT = MediaT & {
	year: string;
	grade: string;
	month: string;
	subj: string;
};

export type EikenMediaT = MediaT & {
	year: string;
	kai: string;
	grade: string;
	type: string;
};

export type LabelValueT<ValueT = number> = {
	label: string;
	shortLabel?: string;
	value: ValueT;
};
