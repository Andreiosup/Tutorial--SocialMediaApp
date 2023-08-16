"use client"

import * as z from "zod"
import { useForm } from "react-hook-form";
import { currentUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { waveValidation } from "@/lib/validation/wave";
import { Input } from "../ui/input";
import { createWave } from "@/lib/actions/wave.actions";




const PostWave = ({ userId }: { userId: string }) => {
    const pathname = usePathname()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(waveValidation),
        defaultValues: {
            wave: "",
            accountId: userId
        }
    })

    const onSubmit =async (values: z.infer<typeof waveValidation>) => {
        await createWave({
            text:values.wave,
            author: userId, 
            communityId: null, 
            path: pathname
        })

        router.push('/')
    }

    return (
        <Form {...form}>
            {/* @ts-ignore */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 flex flex-col justify-start gap-10'>
                <FormField
                    control={form.control}
                    name='wave'
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1' >
                                <Textarea
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-orange-500">
                    Post Wave
                </Button>
            </form>
        </Form>
    )
}

export default PostWave