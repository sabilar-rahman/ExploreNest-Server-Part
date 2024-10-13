/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'

import { Post } from '../post/post.model'
import { Comment } from './comment.model'
import AppError from '../../errors/AppError'

// create comment
const createComment = async (payload: {
  content: string
  author: string
  postId: string
}) => {
  const comment = await (
    await (await Comment.create(payload)).populate('author')
  ).populate('postId')
  if (comment) {
    //   Add the comment to the post
    await Post.findByIdAndUpdate(payload?.postId, {
      $push: { comments: comment._id },
    })
  }
  return comment
}

// get comments by post id
const getCommentByPostId = async (id: string) => {
  const result = await Comment.find({ postId: id })
    .populate('author')
    .populate('postId')
  return result
}

// update comment
const updateComment = async (commentId: string, content: string) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found')
  }
  comment.content = content
  const result = await comment.save()
  return result
}

// delete comment
const deleteComment = async (postId: string, commentId: string) => {
  const comment = await Comment.findById(commentId)
  const post: any = await Post.findById(postId)

  if (!comment || !post) {
    throw new AppError(httpStatus.NOT_FOUND, 'not found')
  }
  const result = await Comment.findByIdAndDelete(commentId)
  // Remove the comment from the post's comment list
  if (result) {
    post.comments.pull(commentId)
    await post.save()
  }
  return result
}

export const CommentService = {
  createComment,
  getCommentByPostId,
  updateComment,
  deleteComment,
}