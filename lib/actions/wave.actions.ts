"use server"

import { revalidatePath } from "next/cache";
import User from "../models/usermodel";
import Wave from "../models/wavemodel";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}
export async function createWave({ text, author, communityId, path }:Params) {
    try { 
        await connectToDB()
    
        const newWave = await Wave.create({
            text,
            author,
            community: null
        })
    
        await User.findByIdAndUpdate(author,{
            $push:{waves: newWave._id}
        })
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create Wave: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber=1,pageSize=20) {

    const skipAmount = (pageNumber - 1) * pageSize;
    
    try {
        connectToDB()

        const postsQuery = Wave.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })    
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
              path: "author",
              model: User,
            })
            .populate({
                path: "children", 
                populate: {
                  path: "author", 
                  model: User,
                  select: "_id name parentId image", 
                },
            });
        
        const totalPostsCount = await Wave.countDocuments({
            parentId: { $in: [null, undefined] },
        });
        
        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;
      
        return { posts, isNext };

    } catch (error: any) {
        throw new Error(`Unable to fetch waves ${error.message}`);
    }
}

export async function fetchWaveById(waveId: string) {
    try {
        connectToDB()

        const wave = Wave.findById(waveId)
            .populate({
                path:"author",
                model:User,
                select:"_id id name image"
            })
            .populate({
                path: "children", 
                populate: [
                  {
                    path: "author", 
                    model: User,
                    select: "_id id name parentId image", 
                  },
                  {
                    path: "children", 
                    model: Wave, 
                    populate: {
                      path: "author", 
                      model: User,
                      select: "_id id name parentId image", 
                    },
                  },
                ],
            })
            .exec();

        return wave
    } catch (error) {
        throw new Error("Unable to fetch wave");
    }
}

export async function addCommentToWave (  
    waveId: string,
    commentText: string,
    userId: string,
    path: string
){
    connectToDB()
    try {
        const originalWave = await Wave.findById(waveId)

        if (!originalWave) {
            throw new Error("Wave not found");
        }

        const commentWave = new Wave({
            text: commentText,
            author: userId,
            parentId: waveId, 
        });

        const savedCommentWave = await commentWave.save();

        originalWave.children.push(savedCommentWave._id);

        await originalWave.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error adding comment to wave: ${error.message}`);
    }
}



export async function addLikeToWave(
  waveId: string,
  userId: string,
  path: string
) {
  connectToDB()

  try {
    const waveToLike = await Wave.findById(waveId)

    if (!waveToLike) {
        throw new Error("Wave not found");
    }

    

    const userHasLikedPost = waveToLike.likes.includes(userId)

    if(userHasLikedPost){
      waveToLike.likes.remove(userId)
    }
    else{
      waveToLike.likes.push(userId)
    }


    await waveToLike.save()

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding like to wave: ${error.message}`);
  }
}

async function fetchAllChildWaves(WaveId: string): Promise<any[]> {
    const childWaves = await Wave.find({ parentId: WaveId });
  
    const descendantWaves = [];
    for (const childWave of childWaves) {
      const descendants = await fetchAllChildWaves(childWave._id);
      descendantWaves.push(childWave, ...descendants);
    }
  
    return descendantWaves;
  }
export async function deleteWave(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the Wave to be deleted (the main Wave)
      const mainWave = await Wave.findById(id).populate("author");// add community later
  
      if (!mainWave) {
        throw new Error("Wave not found");
      }
  
      // Fetch all child Waves and their descendants recursively
      const descendantWaves = await fetchAllChildWaves(id);
  
      // Get all descendant Wave IDs including the main Wave ID and child Wave IDs
      const descendantWaveIds = [
        id,
        ...descendantWaves.map((wave) => wave._id),
      ];
  
      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantWaves.map((wave) => wave.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainWave.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
    //   const uniqueCommunityIds = new Set(
    //     [
    //       ...descendantWaves.map((wave) => wave.community?._id?.toString()), // Use optional chaining to handle possible undefined values
    //       mainWave.community?._id?.toString(),
    //     ].filter((id) => id !== undefined)
    //   );
  
      // Recursively delete child Waves and their descendants
      await Wave.deleteMany({ _id: { $in: descendantWaveIds } });
  
      // Update User model
      await User.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { waves: { $in: descendantWaveIds } } }
      );
  
      // Update Community model
    //   await Community.updateMany(
    //     { _id: { $in: Array.from(uniqueCommunityIds) } },
    //     { $pull: { waves: { $in: descendantWaveIds } } }
    //   );
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to delete Wave: ${error.message}`);
    }
}
