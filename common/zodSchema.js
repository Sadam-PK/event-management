import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

export const signUpSchema = z.object({
  role: z.enum(["organizer", "attendee"]),
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  time: z.string().optional(),
  maxAttendees: z
    .number()
    .int()
    .positive("Max attendees must be a positive integer"),
});
