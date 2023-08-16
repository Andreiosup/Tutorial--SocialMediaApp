import * as z from "zod"

export const waveValidation = z.object({
    wave: z.string().nonempty().min(3),
    accountId: z.string()
})

export const CommentValidation = z.object({
    wave: z.string().nonempty().min(3),
})