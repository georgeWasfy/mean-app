import { z } from 'zod';
import { PaginatedRequestSchema } from '../../schema/helpers.schema';

export const UserResourceSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string().email('This is not a valid email.'),
    is_active: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
    password: z.string(),
    hashedRt: z.string(),
  })
  .required();


export const CreateUserSchema = UserResourceSchema.omit({
  is_active: true,
  id: true,
  created_at: true,
  updated_at: true,
  hashedRt: true
});

export const UserQuerySchema = z.object({
  paging: PaginatedRequestSchema.optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
export type UserResourceType = z.infer<typeof UserResourceSchema>;
export type UserQueryType = z.infer<typeof UserQuerySchema>;
