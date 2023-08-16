import WaveCard from "@/components/cards/WaveCard";
import { fetchPosts } from "@/lib/actions/wave.actions"
import { currentUser } from "@clerk/nextjs"


export default async function Home() {

  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const result = await fetchPosts()



  return (
    <>
      <h1 className='head-text text-left'>
        Home <span className="orange_gradient">Page</span>
      </h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts.length === 0 ? (
          <p className="no-result">No posts</p>
        ) : (
          <>
            {result?.posts.map((post) => (
              <WaveCard
                key={post._id}
                id={post._id}
                currentUserId={clerkUser.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}