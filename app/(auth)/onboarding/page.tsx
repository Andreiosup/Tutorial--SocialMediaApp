import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const databaseUser = await fetchUser(clerkUser?.id);
  if (databaseUser?.onboarded) redirect("/")

  const userData = {
    id : clerkUser?.id,
    objectId: databaseUser?._id,
    username: databaseUser?.username || clerkUser?.username,
    name: databaseUser?.name || clerkUser?.firstName || "",
    bio: databaseUser?.bio || "",
    image: databaseUser?.image || clerkUser?.imageUrl
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className="head-text">
        Onboard to <span className="orange_gradient">Wavechat</span>
      </h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use the platfrom
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} buttonTitle="Continue" />
      </section>
    </main>
  )
}

export default OnboardingPage