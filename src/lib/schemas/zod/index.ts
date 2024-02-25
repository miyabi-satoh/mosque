import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
	'ReadUncommitted',
	'ReadCommitted',
	'RepeatableRead',
	'Serializable'
]);

export const UserScalarFieldEnumSchema = z.enum([
	'id',
	'username',
	'hashedPassword',
	'role',
	'fullName',
	'displayName',
	'email',
	'code',
	'avatar',
	'lastLoginAt'
]);

export const SessionScalarFieldEnumSchema = z.enum(['id', 'userId', 'expiresAt']);

export const ExamScalarFieldEnumSchema = z.enum(['examType', 'name', 'sortOrder']);

export const ArchiveScalarFieldEnumSchema = z.enum([
	'id',
	'title',
	'path',
	'root',
	'depth',
	'sortOrder'
]);

export const ArchiveItemScalarFieldEnumSchema = z.enum([
	'id',
	'archiveId',
	'path',
	'year',
	'strYear',
	'grade',
	'strGrade',
	'section',
	'strSection',
	'title',
	'published'
]);

export const ResourceScalarFieldEnumSchema = z.enum([
	'id',
	'examType',
	'year',
	'publisher',
	'grade',
	'numOf',
	'category',
	'title',
	'shortTitle',
	'path'
]);

export const TempResourceScalarFieldEnumSchema = z.enum([
	'id',
	'sessionId',
	'state',
	'examType',
	'year',
	'publisher',
	'grade',
	'numOf',
	'category',
	'title',
	'shortTitle',
	'path'
]);

export const LinkScalarFieldEnumSchema = z.enum(['id', 'url', 'title', 'sortOrder']);

export const ChannelScalarFieldEnumSchema = z.enum([
	'id',
	'name',
	'description',
	'private',
	'createdAt',
	'updatedAt',
	'createdBy',
	'updatedBy'
]);

export const ChannelMemberScalarFieldEnumSchema = z.enum(['channelId', 'userId']);

export const MessageScalarFieldEnumSchema = z.enum([
	'id',
	'message',
	'createdAt',
	'updatedAt',
	'userId',
	'channelId'
]);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const UserRoleEnumSchema = z.enum(['USER', 'STAFF', 'ADMIN', 'RETIRED']);

export type UserRoleEnumType = `${z.infer<typeof UserRoleEnumSchema>}`;

export const ExamTypeEnumSchema = z.enum(['ctest', 'eiken', 'kyote']);

export type ExamTypeEnumType = `${z.infer<typeof ExamTypeEnumSchema>}`;

export const ArchiveModuleSchema = z.enum(['common', 'exam', 'kentei']);

export type ArchiveModuleType = `${z.infer<typeof ArchiveModuleSchema>}`;

export const ResourceStateEnumSchema = z.enum(['ok', 'new']);

export type ResourceStateEnumType = `${z.infer<typeof ResourceStateEnumSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	role: UserRoleEnumSchema,
	id: z.string(),
	username: z.string(),
	hashedPassword: z.string(),
	fullName: z.string().nullable(),
	displayName: z.string().nullable(),
	email: z.string().nullable(),
	code: z.string().nullable(),
	avatar: z.string().nullable(),
	lastLoginAt: z.coerce.date().nullable()
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	expiresAt: z.coerce.date()
});

export type Session = z.infer<typeof SessionSchema>;

/////////////////////////////////////////
// EXAM SCHEMA
/////////////////////////////////////////

export const ExamSchema = z.object({
	examType: ExamTypeEnumSchema,
	name: z.string(),
	sortOrder: z.number().int()
});

export type Exam = z.infer<typeof ExamSchema>;

/////////////////////////////////////////
// ARCHIVE SCHEMA
/////////////////////////////////////////

export const ArchiveSchema = z.object({
	id: z.string().cuid(),
	title: z.string().min(1),
	path: z.string().min(1).toLowerCase(),
	root: z.string().min(1),
	depth: z.number().int(),
	sortOrder: z.number().int()
});

export type Archive = z.infer<typeof ArchiveSchema>;

/////////////////////////////////////////
// ARCHIVE ITEM SCHEMA
/////////////////////////////////////////

export const ArchiveItemSchema = z.object({
	id: z.string().cuid(),
	archiveId: z.string(),
	path: z.string(),
	year: z.number().int().nullable(),
	strYear: z.string().nullable(),
	grade: z.number().int().nullable(),
	strGrade: z.string().nullable(),
	section: z.number().int().nullable(),
	strSection: z.string().nullable(),
	title: z.string(),
	published: z.boolean()
});

export type ArchiveItem = z.infer<typeof ArchiveItemSchema>;

/////////////////////////////////////////
// RESOURCE SCHEMA
/////////////////////////////////////////

export const ResourceSchema = z.object({
	examType: ExamTypeEnumSchema,
	id: z.string(),
	year: z.number().int(),
	publisher: z.string(),
	grade: z.number().int(),
	numOf: z.number().int(),
	category: z.number().int(),
	title: z.string(),
	shortTitle: z.string(),
	path: z.string()
});

export type Resource = z.infer<typeof ResourceSchema>;

/////////////////////////////////////////
// TEMP RESOURCE SCHEMA
/////////////////////////////////////////

export const TempResourceSchema = z.object({
	state: ResourceStateEnumSchema,
	examType: ExamTypeEnumSchema,
	id: z.string(),
	sessionId: z.string(),
	year: z.number().int(),
	publisher: z.string(),
	grade: z.number().int(),
	numOf: z.number().int(),
	category: z.number().int(),
	title: z.string(),
	shortTitle: z.string(),
	path: z.string()
});

export type TempResource = z.infer<typeof TempResourceSchema>;

/////////////////////////////////////////
// LINK SCHEMA
/////////////////////////////////////////

export const LinkSchema = z.object({
	id: z.string().cuid(),
	url: z.string(),
	title: z.string(),
	sortOrder: z.number().int()
});

export type Link = z.infer<typeof LinkSchema>;

/////////////////////////////////////////
// CHANNEL SCHEMA
/////////////////////////////////////////

export const ChannelSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string().nullable(),
	private: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	createdBy: z.string(),
	updatedBy: z.string()
});

export type Channel = z.infer<typeof ChannelSchema>;

/////////////////////////////////////////
// CHANNEL MEMBER SCHEMA
/////////////////////////////////////////

export const ChannelMemberSchema = z.object({
	channelId: z.string(),
	userId: z.string()
});

export type ChannelMember = z.infer<typeof ChannelMemberSchema>;

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
	id: z.string().cuid(),
	message: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.string(),
	channelId: z.string()
});

export type Message = z.infer<typeof MessageSchema>;
