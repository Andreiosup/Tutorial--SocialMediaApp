import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteWave from "../shared/DeleteWave";
import LikeWave from "../forms/LikeWave";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
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
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;
    likes: []
}

const WaveCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
    likes
}: Props) => {
    return (

        <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
            }`}>
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                            <Image
                                src={author.image}
                                alt='user_community_image'
                                fill
                                className='cursor-pointer rounded-full'
                            />
                        </Link>

                        <div className='thread-card_bar' />
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {author.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>

                        <div className=" mt-5 flex  gap-3">
                            <LikeWave
                                likes={likes}
                                waveId={id}
                                currentUserId={currentUserId}
                            />

                            <Link
                                href={`/wave/${id}`}
                            >
                                <Image
                                    src="/assets/reply.svg"
                                    alt="heart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                            </Link>
                            {comments && comments.length > 0 ? (
                                <p className="mt-1 text-subtle-medium text-gray-1">
                                    {comments.length} repl{comments.length === 1 ? "y" : "ies"}
                                </p>
                            ) : (
                                <p className="mt-1 text-subtle-medium text-gray-1">
                                    No replies
                                </p>
                            )}
                            <DeleteWave
                                threadId={JSON.stringify(id)}
                                currentUserId={currentUserId}
                                authorId={author.id}
                                parentId={parentId}
                                isComment={isComment}
                            />
                        </div>
                        <div className={`${isComment && "mb-10"} mt-5`}>

                            <p className=' text-subtle-medium text-gray-1 '>
                                {formatDateString(createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </article>
    )
}

export default WaveCard