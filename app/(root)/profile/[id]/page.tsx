import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

// import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";
import WavesTab from "@/components/shared/WavesTab";


const ProfilePage = async ({params} :{params: {id: string}}) => {
  const clerkUser = await currentUser()

  if (!clerkUser) return null

  const paramsUser = await fetchUser(params.id)

  if (!paramsUser?.onboarded) redirect("/onboarding")

  
  return (
    <section>
       <ProfileHeader
        accountId={paramsUser.id}
        authUserId={clerkUser.id}
        name={paramsUser.name}
        username={paramsUser.username}
        imgUrl={paramsUser.image}
        bio={paramsUser.bio}
      /> 

      <div className="mt-9">
        <WavesTab
          currentUserId={clerkUser.id}
          accountId={params.id}
          accountType='User'
        />
      </div>

      
          
    </section>
  )
}

export default ProfilePage