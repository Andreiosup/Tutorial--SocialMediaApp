import PostWave from "@/components/forms/PostWave"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"



const CreateWavePage = async () => {
    const clerkUser = await currentUser()

    if (!clerkUser) return null

    const databaseUser = await fetchUser(clerkUser.id)

    if (!databaseUser?.onboarded) redirect("/onboarding")
    return (
        <>
            <h1 className='head-text'>
                Create <span className='orange_gradient'>Wave</span>
            </h1>
            <PostWave userId={databaseUser?._id}/>
        </>
    )
}

export default CreateWavePage