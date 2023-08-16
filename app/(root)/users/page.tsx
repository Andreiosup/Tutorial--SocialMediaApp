import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";


const Page = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser) return null

  const databaseUser = await fetchUser(clerkUser.id)

  if (!databaseUser?.onboarded) redirect("/onboarding")

  const result = await fetchUsers({
    userId: clerkUser.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });
  
  return (
    <section>
      <h1 className="head-text mb-10 ">
        Users <span className="orange_gradient">Page</span>
      </h1>
      <div className='mt-14 flex flex-col gap-9'>

        {result.users.length === 0 ? (
          <p className='no-result'>There are no users other than you</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                type="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default Page