import { redirect } from "next/navigation";

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";
// import { fetchUserPosts } from "@/lib/actions/user.actions";

import WaveCard from "../cards/WaveCard";
import { fetchUserWaves } from "@/lib/actions/user.actions";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}
interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
const WavesTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserWaves(accountId)

  if (!result) redirect("/")



  return (
    <section className="className='mt-9 flex flex-col gap-10">
      {result.waves.map((wave: any) => {
        return (
          <WaveCard
            key={wave._id}
            id={wave._id}
            currentUserId={currentUserId}
            parentId={wave.parentId}
            content={wave.text}
            author={
              accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: wave.author.name,
                  image: wave.author.image,
                  id: wave.author.id,
                }

            }
            community={wave.community}
            createdAt={wave.createdAt}
            comments={wave.children}
            likes={wave.likes}
          />
        )
      })}
    </section>
  )
}

export default WavesTab