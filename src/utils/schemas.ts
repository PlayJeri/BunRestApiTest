import { z } from 'zod';


export const registrationSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must contain 3-16 characters" })
        .max(16, { message: "Username must contain 3-16 characters" }),
    password: z.string()
        .min(6, { message: "Password must contain at least six (6) characters" }),
    password2: z.string(),
    email: z.string()
        .email({message: "Make sure to enter a valid email" }),
})
.refine((data) => data.password === data.password2, {
    message: "Passwords don't match"
})


export const loginSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must contain 3-16 characters" })
        .max(16, { message: "Username must contain 3-16 characters" }),
    password: z.string()
        .min(6, { message: "Password must contain at least six (6) characters" }),
})

export const createPostSchema = z.object({
    content: z.string()
        .min(1, {message: "Post must contain at least one (1) character" })
        .max(256, {message: "Post can contain max of 256 characters" }),
})

export const createCommentSchema = z.object({
    content: z.string()
        .min(1, {message: "Comment must contain at least one (1) character" })
        .max(128, {message: "Comment can contain max of 128 characters" }),
    postId: z.number()
})