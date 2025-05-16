import { z } from 'zod';

import { baseEntitySchema } from './common';

import { USER_ROLE } from '@/configs/configs';

const passwordSchema = z
  .string()
  .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
  .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
  .regex(new RegExp('.*\\d.*'), 'One number')
  .regex(
    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
    'One special character',
  )
  .min(8, 'Must be at least 8 characters in length');

const userFormSchema = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string({
    required_error: 'Please enter your first name',
  }),
  lastName: z.string({
    required_error: 'Please enter your last name',
  }),
  phone: z.string().nullable().optional().transform((val) => val === '' ? undefined : val),
  email: z
    .string({
      required_error: 'Please enter your email',
    })
    .email('Please enter a valid email'),
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  password: passwordSchema,
  role: z.enum(USER_ROLE).optional().default('user'),
});

const userEditFormSchema = userFormSchema.extend({
  password: passwordSchema.optional(),
});

const userSchema = userFormSchema.extend(baseEntitySchema);

const userWithoutPasswordSchema = userSchema.omit({ password: true });

const userLoginFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' })
    .email('Please enter a valid email'),
});

type UserEditForm = z.infer<typeof userEditFormSchema>;
type UserForm = z.infer<typeof userFormSchema>;
type User = z.infer<typeof userSchema>;
type UserWithoutPassword = Omit<User, 'password'>;

export {
  type UserForm,
  type User,
  type UserWithoutPassword,
  type UserEditForm,
  userLoginFormSchema,
  userWithoutPasswordSchema,
  userFormSchema,
  userSchema,
  userEditFormSchema,
  passwordSchema,
};
