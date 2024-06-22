import { z } from "zod";

export const signInSchema = z.object({
    content: z.string().min(10,{message:"content must be 10 characters"}).max(300, "max chars should be 300 "),


})