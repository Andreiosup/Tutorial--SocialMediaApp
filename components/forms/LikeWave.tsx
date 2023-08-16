"use client"

import { addLikeToWave } from "@/lib/actions/wave.actions"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

const LikeWave = ({
    likes,
    waveId,
    currentUserId
}:{
    likes:Array<any>,
    waveId: string,
    currentUserId: string
}) => {
    const pathname= usePathname()

    const currentUserLiked= likes.includes(currentUserId)
    
    return (
        <>
            <div onClick={async () => {
                await addLikeToWave(waveId,currentUserId,pathname)
            }}>
                <Image
                    src={
                        currentUserLiked ? '/assets/heart-like.svg': '/assets/heart-gray.svg'
                    }
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'

                />
            </div>
            <p className="mt-1 text-subtle-medium text-gray-1">
                {likes.length}
            </p>
        </>
    )
}

export default LikeWave