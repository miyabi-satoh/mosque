type Primitive = number | string | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line @typescript-eslint/ban-types
type Builtin = Primitive | Function | Date | Error | RegExp;

export type DeepNonNullable<T> = T extends Builtin
	? NonNullable<T>
	: { [key in keyof T]-?: DeepNonNullable<T[key]> };

export type BlobType = 'text' | 'img' | 'audio' | 'video' | 'pdf' | 'unknown' | 'error';

export type Fetch = typeof fetch;
