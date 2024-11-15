import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interfaces/file.interface";
import { PostsSearchableFields } from "./post.constant";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

const createPostIntoDb = async (payload: TPost, images: TImageFiles) => {
  payload.images = images.postImages?.map((image) => image?.path);

  const post = await Post.create(payload);
  return post;
};

const getAllPostsFromDb = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(
    Post.find({ isDelete: false }).populate({
      path: "author",
      match: { status: "ACTIVE" },
    }),
    query,
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

const updatePostIntoDB = async (
  postId: string,
  payload: TPost,
  images: TImageFiles,
) => {
  if (images.postImages?.length > 0) {
    payload.images = images.postImages.map((image) => image.path);
  }

  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
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
    { new: true },
  );
  return result;
};

const votePostIntoDB = async (
  postId: string,
  action: "upvote" | "downvote",
  voterEmail: string,
) => {
  const voter = await User.isUserExistsByEmail(voterEmail);
  if (!voter) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (voter?.status === "BLOCKED") {
    throw new AppError(httpStatus.NOT_FOUND, "User Blocked!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "No post found!");
  }

  if (post.isDelete) {
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
    isDelete: false,
  }).populate("author");
  return result;
};

export const PostServices = {
  createPostIntoDb,
  getAllPostsFromDb,
  getPostByFromDB,
  updatePostIntoDB,
  deletePostIntoDb,
  votePostIntoDB,
  getCurrentUserPost,
};
