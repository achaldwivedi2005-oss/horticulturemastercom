import { z } from "zod";

export const targetExams = ["CUET-PG", "ICAR JRF", "ICAR SRF", "ASRB NET", "Other"] as const;

/** Mirrors the database checks on public.profiles. */
export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  target_exam: z.enum(targetExams, { errorMap: () => ({ message: "Choose your target exam" }) }),
  university: z.string().trim().min(1, "Choose your university").max(200, "University name is too long"),
  state: z.string().trim().min(1, "Choose your state").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{7,16}$/, "Enter a valid phone number (digits only, optional +)")
    .or(z.literal(""))
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const signUpSchema = profileSchema.extend({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72, "Password is too long"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Please write a message").max(2000, "Message is too long (max 2000 characters)"),
});
