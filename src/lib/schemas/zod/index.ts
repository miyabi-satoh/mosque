import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','role','fullName','displayName','email','code']);

export const SessionScalarFieldEnumSchema = z.enum(['id','user_id','active_expires','idle_expires']);

export const KeyScalarFieldEnumSchema = z.enum(['id','hashed_password','user_id']);

export const ExamScalarFieldEnumSchema = z.enum(['examType','shortName','fullName','sortOrder','labelGrade','labelNumOf']);

export const ResourceScalarFieldEnumSchema = z.enum(['id','examType','year','grade','numOf','category','title','shortTitle','path']);

export const TempResourceScalarFieldEnumSchema = z.enum(['id','sessionId','state','examType','year','grade','numOf','category','title','shortTitle','path']);

export const LinkScalarFieldEnumSchema = z.enum(['id','url','title','sortOrder']);

export const PostScalarFieldEnumSchema = z.enum(['id','title','content','username','password','createdAt','updatedAt']);

export const CommentScalarFieldEnumSchema = z.enum(['id','message','username','password','createdAt','updatedAt','postId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserRoleSchema = z.enum(['USER','STAFF','ADMIN']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const ExamTypeSchema = z.enum(['ctest','eiken']);

export type ExamTypeType = `${z.infer<typeof ExamTypeSchema>}`

export const ResourceStateSchema = z.enum(['ok','new','missing']);

export type ResourceStateType = `${z.infer<typeof ResourceStateSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.string(),
  username: z.string(),
  fullName: z.string().nullable(),
  displayName: z.string().nullable(),
  email: z.string().nullable(),
  code: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// KEY SCHEMA
/////////////////////////////////////////

export const KeySchema = z.object({
  id: z.string(),
  hashed_password: z.string().nullable(),
  user_id: z.string(),
})

export type Key = z.infer<typeof KeySchema>

/////////////////////////////////////////
// EXAM SCHEMA
/////////////////////////////////////////

export const ExamSchema = z.object({
  examType: ExamTypeSchema,
  shortName: z.string(),
  fullName: z.string(),
  sortOrder: z.number().int(),
  labelGrade: z.string(),
  labelNumOf: z.string(),
})

export type Exam = z.infer<typeof ExamSchema>

/////////////////////////////////////////
// RESOURCE SCHEMA
/////////////////////////////////////////

export const ResourceSchema = z.object({
  examType: ExamTypeSchema,
  id: z.string(),
  year: z.number().int(),
  grade: z.number().int(),
  numOf: z.number().int(),
  category: z.number().int(),
  title: z.string(),
  shortTitle: z.string(),
  path: z.string(),
})

export type Resource = z.infer<typeof ResourceSchema>

/////////////////////////////////////////
// TEMP RESOURCE SCHEMA
/////////////////////////////////////////

export const TempResourceSchema = z.object({
  state: ResourceStateSchema,
  examType: ExamTypeSchema,
  id: z.string(),
  sessionId: z.string(),
  year: z.number().int(),
  grade: z.number().int(),
  numOf: z.number().int(),
  category: z.number().int(),
  title: z.string(),
  shortTitle: z.string(),
  path: z.string(),
})

export type TempResource = z.infer<typeof TempResourceSchema>

/////////////////////////////////////////
// LINK SCHEMA
/////////////////////////////////////////

export const LinkSchema = z.object({
  id: z.string().cuid(),
  url: z.string(),
  title: z.string(),
  sortOrder: z.number().int(),
})

export type Link = z.infer<typeof LinkSchema>

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
  updatedAt: z.coerce.date(),
})

export type Post = z.infer<typeof PostSchema>

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
  postId: z.string(),
})

export type Comment = z.infer<typeof CommentSchema>
