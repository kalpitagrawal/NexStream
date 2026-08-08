import { z } from "zod";

// ==================== User Schemas ====================

const registerSchema = z.object({
    fullname: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters"),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format"),
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    username: z.string().trim().optional(),
    password: z.string({ required_error: "Password is required" }),
}).refine(
    (data) => data.email || data.username,
    { message: "Either email or username is required" }
);

const changePasswordSchema = z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z
        .string({ required_error: "New password is required" })
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/[0-9]/, "New password must contain at least one number"),
});

const updateAccountSchema = z.object({
    fullname: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters"),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format"),
});

// ==================== Video Schemas ====================

const publishVideoSchema = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),
    description: z
        .string({ required_error: "Description is required" })
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description must be at most 5000 characters"),
});

const updateVideoSchema = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),
    description: z
        .string({ required_error: "Description is required" })
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description must be at most 5000 characters"),
});

// ==================== Comment Schemas ====================

const commentSchema = z.object({
    content: z
        .string({ required_error: "Comment content is required" })
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment must be at most 1000 characters"),
});

// ==================== Tweet Schemas ====================

const tweetSchema = z.object({
    content: z
        .string({ required_error: "Tweet content is required" })
        .trim()
        .min(1, "Tweet cannot be empty")
        .max(500, "Tweet must be at most 500 characters"),
});

// ==================== Playlist Schemas ====================

const createPlaylistSchema = z.object({
    name: z
        .string({ required_error: "Playlist name is required" })
        .trim()
        .min(1, "Playlist name cannot be empty")
        .max(100, "Playlist name must be at most 100 characters"),
    description: z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .default(""),
});

const updatePlaylistSchema = z.object({
    name: z
        .string({ required_error: "Playlist name is required" })
        .trim()
        .min(1, "Playlist name cannot be empty")
        .max(100, "Playlist name must be at most 100 characters"),
    description: z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .optional(),
});

export {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateAccountSchema,
    publishVideoSchema,
    updateVideoSchema,
    commentSchema,
    tweetSchema,
    createPlaylistSchema,
    updatePlaylistSchema,
};
