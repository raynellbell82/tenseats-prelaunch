import { z } from "zod";

// Step 1: Credentials
export const credentialsSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Step 2: Profile with age validation
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine(
    (dob) => {
      if (!dob) return false;
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) return false;

      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return birthDate <= eighteenYearsAgo;
    },
    {
      message: "You must be at least 18 years old to sign up",
    }
  ),
});

// Step 3: Username
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

// Step 4: Metro
export const metroSchema = z.object({
  metro: z.string().min(1, "Please select your metro area"),
});

// Combined schema for full signup form
export const signupSchema = credentialsSchema
  .and(profileSchema)
  .and(usernameSchema)
  .and(metroSchema);

export type SignupFormData = z.infer<typeof signupSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Password reset request
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// New password form
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Export individual step types for wizard
export type CredentialsFormData = z.infer<typeof credentialsSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type UsernameFormData = z.infer<typeof usernameSchema>;
export type MetroFormData = z.infer<typeof metroSchema>;
