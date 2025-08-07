import { z } from 'zod';

export const authSchema = z.object({
    email: z.email('Invalid email address'),
});

export const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.email({
        message: 'Please enter a valid email.',
    }),
    bio: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
