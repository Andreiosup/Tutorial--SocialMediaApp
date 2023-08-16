import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";


const Page = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser) return null

  const databaseUser = await fetchUser(clerkUser.id)

  if (!databaseUser?.onboarded) redirect("/onboarding")

  const activity = await getActivity(databaseUser._id)
  console.log(activity)
  return (
    <section>
      <h1 className="head-text mb-10 ">
        Activity <span className="orange_gradient">Page</span>
      </h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/wave/${activity.parentId}`}>
                <article className='activity-card'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-2'>
                      <Image
                        src={activity.author.image}
                        alt='user_logo'
                        width={20}
                        height={20}
                        className='rounded-full object-cover'
                      />
                      <p className='!text-small-regular text-light-1'>
                        <span className='mr-1 orange_gradient'>
                          {activity.author.name}
                        </span>{" "}
                        replied to you
                      </p>
                      <p className='!text-small-regular text-gray-500'>
                        {activity.text.slice(0, 30)}...
                      </p>
                    </div>
                    <p className='text-small-regular text-white'>
                      {formatDateString(activity.createdAt)}
                    </p>
                  </div>
                </article>



              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </section>
  )
}

export default Page