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

export const UserScalarFieldEnumSchema = z.enum(['id', 'username', 'role']);

export const SessionScalarFieldEnumSchema = z.enum([
	'id',
	'user_id',
	'active_expires',
	'idle_expires'
]);

export const KeyScalarFieldEnumSchema = z.enum(['id', 'hashed_password', 'user_id']);

export const ExamScalarFieldEnumSchema = z.enum([
	'examType',
	'shortName',
	'fullName',
	'sortOrder',
	'labelGrade',
	'labelNumOf'
]);

export const ResourceScalarFieldEnumSchema = z.enum([
	'id',
	'examType',
	'year',
	'grade',
	'numOf',
	'category',
	'title',
	'shortTitle',
	'path'
]);

export const ResourceTempScalarFieldEnumSchema = z.enum([
	'id',
	'sessionId',
	'state',
	'examType',
	'year',
	'grade',
	'numOf',
	'category',
	'title',
	'shortTitle',
	'path'
]);

export const SiteLinkScalarFieldEnumSchema = z.enum(['id', 'url', 'title', 'sortOrder']);

export const PostScalarFieldEnumSchema = z.enum([
	'id',
	'title',
	'content',
	'username',
	'password',
	'createdAt',
	'updatedAt'
]);

export const CommentScalarFieldEnumSchema = z.enum([
	'id',
	'message',
	'username',
	'password',
	'createdAt',
	'updatedAt',
	'postId'
]);

export const StaffScalarFieldEnumSchema = z.enum([
	'id',
	'sei',
	'mei',
	'seiKana',
	'meiKana',
	'nickname',
	'retired'
]);

export const StaffUserLinkScalarFieldEnumSchema = z.enum(['id', 'staffId', 'userId']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const UserRoleSchema = z.enum(['USER', 'ADMIN', 'STAFF']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`;

export const ExamTypeSchema = z.enum(['ctest', 'eiken']);

export type ExamTypeType = `${z.infer<typeof ExamTypeSchema>}`;

export const ResourceStateSchema = z.enum(['ok', 'new', 'missing']);

export type ResourceStateType = `${z.infer<typeof ResourceStateSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	role: UserRoleSchema,
	id: z.string(),
	username: z.string().nullable()
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	active_expires: z.bigint(),
	idle_expires: z.bigint()
});

export type Session = z.infer<typeof SessionSchema>;

/////////////////////////////////////////
// KEY SCHEMA
/////////////////////////////////////////

export const KeySchema = z.object({
	id: z.string(),
	hashed_password: z.string().nullable(),
	user_id: z.string()
});

export type Key = z.infer<typeof KeySchema>;

/////////////////////////////////////////
// EXAM SCHEMA
/////////////////////////////////////////

export const ExamSchema = z.object({
	examType: ExamTypeSchema,
	shortName: z.string(),
	fullName: z.string(),
	sortOrder: z.number().int(),
	labelGrade: z.string(),
	labelNumOf: z.string()
});

export type Exam = z.infer<typeof ExamSchema>;

/////////////////////////////////////////
// RESOURCE SCHEMA
/////////////////////////////////////////

export const ResourceSchema = z.object({
	examType: ExamTypeSchema,
	id: z.string().cuid(),
	year: z.number().int(),
	grade: z.number().int(),
	numOf: z.number().int(),
	category: z.number().int(),
	title: z.string(),
	shortTitle: z.string(),
	path: z.string()
});

export type Resource = z.infer<typeof ResourceSchema>;

/////////////////////////////////////////
// RESOURCE TEMP SCHEMA
/////////////////////////////////////////

export const ResourceTempSchema = z.object({
	state: ResourceStateSchema,
	examType: ExamTypeSchema,
	id: z.string().cuid(),
	sessionId: z.string(),
	year: z.number().int(),
	grade: z.number().int(),
	numOf: z.number().int(),
	category: z.number().int(),
	title: z.string(),
	shortTitle: z.string(),
	path: z.string()
});

export type ResourceTemp = z.infer<typeof ResourceTempSchema>;

/////////////////////////////////////////
// SITE LINK SCHEMA
/////////////////////////////////////////

export const SiteLinkSchema = z.object({
	id: z.string().cuid(),
	url: z.string(),
	title: z.string(),
	sortOrder: z.number().int()
});

export type SiteLink = z.infer<typeof SiteLinkSchema>;

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
	id: z.string().cuid(),
	title: z.string(),
	content: z.string(),
	username: z.string(),
	password: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export type Post = z.infer<typeof PostSchema>;

/////////////////////////////////////////
// COMMENT SCHEMA
/////////////////////////////////////////

export const CommentSchema = z.object({
	id: z.string().cuid(),
	message: z.string(),
	username: z.string(),
	password: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	postId: z.string()
});

export type Comment = z.infer<typeof CommentSchema>;

/////////////////////////////////////////
// STAFF SCHEMA
/////////////////////////////////////////

export const StaffSchema = z.object({
	id: z.string(),
	sei: z.string(),
	mei: z.string(),
	seiKana: z.string(),
	meiKana: z.string(),
	nickname: z.string().nullable(),
	retired: z.boolean()
});

export type Staff = z.infer<typeof StaffSchema>;

/////////////////////////////////////////
// STAFF USER LINK SCHEMA
/////////////////////////////////////////

export const StaffUserLinkSchema = z.object({
	id: z.string().cuid(),
	staffId: z.string(),
	userId: z.string()
});

export type StaffUserLink = z.infer<typeof StaffUserLinkSchema>;