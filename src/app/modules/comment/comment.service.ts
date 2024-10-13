import { Types } from "mongoose";

import { TComment } from "./comment.interface";
import Comment from "./comment.model";
import Post from "../post/post.model";

const commentIntoPost = async (id: string, payload: TComment) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  const result = await Comment.create(payload);

  // Increment the commentsCount by 1
  post.commentsCount = (post.commentsCount || 0) + 1;

  // Save the updated post
  await post.save();

  return result;
};

const getCommentsByPostFromDB = async (id: string) => {
  const result = await Comment.find({ postId: id })
    .populate("userId", "_id name image")
    .sort({ createdAt: -1 });
  return result;
};

const EditCommentIntoPost = async (id: string, payload: TComment) => {
  const { userId, feedback } = payload;

  const isFeedbackAvailable = await Comment.findById(id);

  if (!isFeedbackAvailable) {
    throw new Error("Comment not found");
  }
  // Compare userId with isFeedbackAvailable.userId
  const isSameUser = new Types.ObjectId(userId).equals(
    isFeedbackAvailable.userId
  );

  if (!isSameUser) {
    throw new Error("Unauthorized: You can only edit your own comments");
  }

  const result = await Comment.findByIdAndUpdate(
    id,
    {
      feedback,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const deleteCommentFromDB = async (id: string, userId: string) => {
  const isCommentAvailable = await Comment.findById(id);
  if (!isCommentAvailable) {
    throw new Error("Comment not found");
  }
  const isSameUser = new Types.ObjectId(userId).equals(
    isCommentAvailable.userId
  );
  if (!isSameUser) {
    throw new Error("You are not authorized to delete");
  }
  const result = await Comment.findByIdAndDelete(id);

  //  downcomment from post
  const postId = isCommentAvailable.postId;

  //  Find the post and decrement the commentsCount
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Decrement commentsCount
  post.commentsCount = (post.commentsCount || 0) - 1;

  // Save the updated post
  await post.save();

  return result;
};

export const commentServices = {
  commentIntoPost,
  EditCommentIntoPost,

  getCommentsByPostFromDB,

  deleteCommentFromDB,
};
