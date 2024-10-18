/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/*
import httpStatus from 'http-status'

import { TPost } from './post.interface'
import { Post } from './post.model'

import { User } from '../user/user.model'
import { searchableFields } from '../utils/searchFields'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'



// create post
const createPostIntoDB = async (payload: TPost) => {
  const result = (
    await (await Post.create(payload)).populate('author')
  ).populate('comments')
  return result
}

// get specific user post
const getUserSinglePost = async (id: string) => {
  const result = await Post.find({ author: id })
    .populate('author')
    .sort({ createdAt: -1 })
  return result
}

// get all post
const getAllPost = async (query: Record<string, unknown>, user: any) => {
  const findUser = await User.findOne({ email: user?.email })
  const userVerified = findUser?.verified
  // Initialize the query
  let postQuery: any = Post.find()

  // If the user is not verified, filter out premium posts
  if (!userVerified) {
    postQuery = postQuery.where({ premium: false })
  }
  const postQueryBuilder = new QueryBuilder(Post.find(), query)
    .search(searchableFields) // Specify the searchable fields
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await postQueryBuilder.modelQuery
    .populate('author')
    .populate('comments')
    .exec()

  // Get total post count and pagination details
  const { total, totalPage, page, limit } = await postQueryBuilder.countTotal()
  return {
    posts: result,
    totalPages: totalPage,
    currentPage: page,
    totalPosts: total,
    limit,
  }
}

//get all posts
const getAllPostsForTable = async () => {
  const result = await Post.find({}).populate('author')
  return result
}

// get post by
const getPostById = async (postId: string) => {
  const result = await Post.findById({ _id: postId }).populate('author')
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upVotes = async (userId: any, postId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!')
  }

  // Check if user has already voted
  const existingVote = post.voters.find(
    voter => String(voter.user) === String(userId),
  )

  if (existingVote) {
    if (existingVote.vote === 'upvote') {
      // User already upvoted, so remove the upvote
      post.upVotes -= 1
      post.voters = post.voters.filter(
        voter => String(voter.user) !== String(userId),
      )
    } else if (existingVote.vote === 'downvote') {
      // User had downvoted, so switch to upvote
      post.downVotes -= 1
      post.upVotes += 1
      existingVote.vote = 'upvote'
    }
  } else {
    // User has not voted, so add an upvote
    post.upVotes += 1
    post.voters.push({ user: userId, vote: 'upvote' })
  }

  const result = await post.save()
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downVotes = async (userId: any, postId: string) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!')
  }
  // Check if user has already voted
  const existingVote = post.voters.find(
    voter => String(voter.user) === String(userId),
  )

  if (existingVote) {
    if (existingVote.vote === 'downvote') {
      // User already downvoted, so remove the downvote
      post.downVotes -= 1
      post.voters = post.voters.filter(
        voter => String(voter.user) !== String(userId),
      )
    } else if (existingVote.vote === 'upvote') {
      // User had upvoted, so switch to downvote
      post.upVotes -= 1
      post.downVotes += 1
      existingVote.vote = 'downvote'
    }
  } else {
    // User has not voted, so add a downvote
    post.downVotes += 1
    post.voters.push({ user: userId, vote: 'downvote' })
  }

  const result = await post.save()
  return result
}

//update service
const updatePostIntoDB = async (id: string, payload: Partial<TPost>) => {
  const service = await Post.findById(id)
  //check isService exists
  if (!service) {
    throw new AppError(404, 'Service not found!')
  }

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

//delete service
const deletePostFromDB = async (id: string) => {
  const service = await Post.findById(id)
  //check isService exists
  if (!service) {
    throw new AppError(404, 'Service not found!')
  }
  const result = await Post.findByIdAndDelete(id)
  return result
}

export const PostService = {
  createPostIntoDB,
  getUserSinglePost,
  getAllPost,
  upVotes,
  downVotes,
  getPostById,
  getAllPostsForTable,
  updatePostIntoDB,
  deletePostFromDB,
}

*/

import httpStatus from "http-status";
// import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
// import { TImageFiles } from "../../interfaces/file.interface";
// import { PostsSearchableFields } from "./post.constant";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";

// const createPostIntoDb = async (payload: TPost, images: TImageFiles) => {
//   payload.images = images.postImages?.map((image) => image?.path);

//   const post = await Post.create(payload);
//   return post;
// };

// create post
const createPostIntoDB = async (payload: TPost) => {
  const result = (
    await (await Post.create(payload)).populate("author")
  ).populate("comments");
  return result;
};

export const PostsSearchableFields = [
  "title",
  "content",
  "image",
  "description",
];

const getAllPostsFromDb = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(
    Post.find({ delete: false }).populate({
      path: "author",
      // match: { status: "ACTIVE" },
    }),
    query
  )
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(PostsSearchableFields);

  const result = await users.modelQuery;

  const filteredPosts = result.filter((post) => post.author !== null);

  return filteredPosts;
};

const getPostByFromDB = async (postId: string) => {
  const result = await Post.findById(postId).populate("author");
  return result;
};

// const updatePostIntoDB = async (
//   postId: string,
//   payload: TPost,
//   images: TImageFiles,
// ) => {
//   if (images.postImages?.length > 0) {
//     payload.images = images.postImages.map((image) => image.path);
//   }

//   const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
//   return result;
// };

// changed id to postId

const updatePostIntoDB = async (postId: string, payload: Partial<TPost>) => {
  // const service = await Post.findById(id)
  // //check isService exists
  // if (!service) {
  //   throw new AppError(404, 'Service not found!')
  // }

  const result = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletePostIntoDb = async (postId: string) => {
  const isPostExists = await Post.findById(postId);

  // check if the post is exist or not
  if (!isPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    { isDelete: true },
    { new: true }
  );
  return result;
};

const votePostIntoDB = async (
  postId: string,
  action: "upvote" | "downvote",
  voterEmail: string
) => {
  //  ________ there need to uncomment

  // const voter = await User.isUserExistsByEmail(voterEmail);

  // Find the user directly by email
  const voter = await User.findOne({ email: voterEmail });

  if (!voter) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // if (voter?.status === "BLOCKED") {
  //   throw new AppError(httpStatus.NOT_FOUND, "User Blocked!");
  // }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "No post found!");
  }

  if (post.delete) {
    throw new AppError(httpStatus.NOT_FOUND, "Post has been deleted");
  }

  const updateOperations: any = {};

  if (action === "upvote") {
    if (post?.upvote?.includes(new mongoose.Types.ObjectId(voter?._id))) {
      updateOperations.$pull = { upvote: voter._id };
    } else {
      updateOperations.$addToSet = { upvote: voter._id };
      updateOperations.$pull = { downvote: voter._id };
    }
  } else if (action === "downvote") {
    if (post?.downvote?.includes(new mongoose.Types.ObjectId(voter?._id))) {
      updateOperations.$pull = { downvote: voter._id };
    } else {
      updateOperations.$addToSet = { downvote: voter._id };
      updateOperations.$pull = { upvote: voter._id };
    }
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateOperations, {
    new: true,
  });

  return updatedPost;
};

const getCurrentUserPost = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const result = await Post.find({
    author: objectId,
    delete: false,
  }).populate("author");
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDb,
  getPostByFromDB,
  updatePostIntoDB,
  deletePostIntoDb,
  votePostIntoDB,
  getCurrentUserPost,
};
