import { z } from 'zod';

export const authSchema = z.object({
    email: z.email('Invalid email address'),
});

export const profileFormSchema = z.object({
    displayName: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.email({
        message: 'Please enter a valid email.',
    }),
    avatar: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type AuthFormData = z.infer<typeof authSchema>;

export const basicInfoSchema = z
    .object({
        gender: z.string().min(1, 'Gender is required').optional(),
        birthDate: z.string().min(1, 'Birth date is required').optional(),
        height: z.number().min(50, 'Height must be at least 50cm').optional(),
        heightUnit: z.enum(['CM', 'INCH']).optional(),
    })
    .refine((data) => (data.height === undefined && data.heightUnit === undefined) || (data.height !== undefined && data.heightUnit !== undefined), {
        message: 'If height is provided, heightUnit must also be provided (and vice versa).',
        path: ['heightUnit'], // error on this field
    });

export const weightGoalsSchema = z
    .object({
        weight: z.number().min(20, 'Weight must be at least 20kg').optional(),
        weightUnit: z.enum(['KG', 'LB']).optional(),
        activityLevel: z.enum(['low', 'moderate', 'high']).optional(),
        goalWeight: z.number().optional(),
        goalCalories: z.number().optional(),
    })
    .refine((data) => (data.weight === undefined && data.weightUnit === undefined) || (data.weight !== undefined && data.weightUnit !== undefined), {
        message: 'Weight and weightUnit must be provided together or omitted together',
        path: ['weightUnit'], // error on this field
    });

export const medicalSchema = z.object({
    hasDiabetes: z.boolean().optional(),
    hasHypertension: z.boolean().optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
});

export const healthSchemas = [basicInfoSchema, weightGoalsSchema, medicalSchema];

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type WeightGoalsData = z.infer<typeof weightGoalsSchema>;
export type MedicalData = z.infer<typeof medicalSchema>;

export type HealthFormData = BasicInfoData & WeightGoalsData & MedicalData;
