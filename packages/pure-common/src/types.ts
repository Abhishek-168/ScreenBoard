import {z} from "zod"

export const userSchema = z.object({
    email: z.email().min(3).max(20),
    password: z.string(),
    name: z.string()
})

export const signinSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string()
})

export const createRoomSchema = z.object({
    name: z.string()
})