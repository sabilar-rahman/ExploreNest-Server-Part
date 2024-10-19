/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'

import { Post } from '../post/post.model'
import { Comment } from './comment.model'
import AppError from '../../errors/AppError'
import { IUser } from '../user/user.interface'
import { TComment } from './comment.interface'

import mongoose, { Types } from 'mongoose'

// create comment
// const createCommentIntoDB = async (payload: {
//   content: string
//   author: string
//   postId: string
// }) => {
//   const comment = await (
//     await (await Comment.create(payload)).populate('author')
//   ).populate('postId')
//   if (comment) {
//     //   Add the comment to the post
//     await Post.findByIdAndUpdate(payload?.postId, {
//       $push: { comments: comment._id },
//     })
//   }
//   return comment
// }


const createCommentIntoDB = async (payload: TComment, userId: string) => {
   // Find the post by its ID
  const post = await Post.findById(payload.post);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found!");
  }

   // Set the commenter field to the user ID
  payload.commenter = new Types.ObjectId(userId);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
     // Create the comment in the database
    const result = await Comment.create([payload], { session });

    // Optionally, increment the comment count on the post
    await Post.findByIdAndUpdate(payload.post, { $inc: { commentCount: 1 } }, { session });

        // Commit the transaction
        await session.commitTransaction();

        // End the session
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};


// get comments by post id
// const getCommentByPostId = async (id: string) => {
//   const result = await Comment.find({ postId: id })
//     .populate('author')
//     .populate('postId')
//   return result
// }


const getCommentByPostId = async (postId: string) => {
  const result = await Comment.find({ post: postId })
    .sort("-createdAt")
    .populate("commenter");
  return result;
};

// update comment
// const updateComment = async (commentId: string, content: string) => {
//   const comment = await Comment.findById(commentId)
//   if (!comment) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Comment not found')
//   }
//   comment.content = content
//   const result = await comment.save()
//   return result
// }

// const updateComment = async (commentId: string, content: string, user: IUser) => {
//   // Find the comment by its ID
//   const comment = await Comment.findById(commentId);

//   if (!comment) {
//     throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
//   }

//   // Check if the user trying to update the comment is the one who created it
//   if (comment.commenter.toString() !== user._id.toString()) {
//     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this comment");
//   }

//   // Update the comment content
//   comment.comment = content;

//   // Save the updated comment
//   const result = await comment.save();

//   return result;
// };


const updateComment = async (commentId: string, content: string, user: IUser) => {
  // Check if user._id exists
  if (!user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User ID is missing");
  }

  // Find the comment by its ID
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Check if the user trying to update the comment is the one who created it
  if (comment.commenter.toString() !== user._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this comment");
  }

  // Update the comment content
  comment.comment = content;

  // Save the updated comment
  const result = await comment.save();

  return result;
};



// delete comment

// const deleteComment = async (postId: string, commentId: string) => {
//   const comment = await Comment.findById(commentId)
//   const post: any = await Post.findById(postId)

//   if (!comment || !post) {
//     throw new AppError(httpStatus.NOT_FOUND, 'not found')
//   }
//   const result = await Comment.findByIdAndDelete(commentId)
//   // Remove the comment from the post's comment list
//   if (result) {
//     post.comments.pull(commentId)
//     await post.save()
//   }
//   return result
// }


const deleteComment = async (id: string, userId: string) => {
  // Find the comment by its ID
  const comment = await Comment.findById(id);

  // Check if the comment exists
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found!");
  }

  // Check if the user trying to delete the comment is the one who created it
  if (comment.commenter.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment!"
    );
  }

  // Delete the comment
  const result = await Comment.findByIdAndDelete(id);
  return result; // Return the result of the deletion
};



export const CommentService = {
  createCommentIntoDB,
  getCommentByPostId,
  updateComment,
  deleteComment,
}