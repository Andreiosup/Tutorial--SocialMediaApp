import { currentUser } from '@clerk/nextjs'

import WaveCard from '@/components/cards/WaveCard'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchWaveById } from '@/lib/actions/wave.actions'
import PostComment from '@/components/forms/PostComment'

const WavePage = async ({ params }: { params: { id: string } }) => {

  if (!params.id) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const databaseUser = await fetchUser(clerkUser.id)
  if (!databaseUser?.onboarded) redirect("/onboarding")

  const wave = await fetchWaveById(params.id)

  return (
    <section className="relative">
      <div>
        <WaveCard
          key={wave._id}
          id={wave._id}
          currentUserId={clerkUser.id}
          parentId={wave.parentId}
          content={wave.text}
          author={wave.author}
          community={wave.community}
          createdAt={wave.createdAt}
          comments={wave.children}
          likes={wave.likes}
        />
      </div>
      <div className="mt-7">
        <PostComment
          waveId={wave.id}
          currentUserImg={databaseUser.image}
          currentUserId={JSON.stringify(databaseUser._id)}
        />
      </div>
      <div className="mt-10">
        {wave.children.map((child: any)=>(
          <WaveCard
          key={child._id}
          id={child._id}
          currentUserId={clerkUser.id}
          parentId={child.parentId}
          content={child.text}
          author={child.author}
          community={child.community}
          createdAt={child.createdAt}
          comments={child.children}
          isComment={true}
          likes={child.likes}
        />
        ))}
      </div>
    </section>
  )
}

export default WavePage