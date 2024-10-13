
import catchAsync from '../utils/catchAsync'
import sendResponse from '../utils/sendResponse'
import { CommentService } from './comment.service'

const createComment = catchAsync(async (req, res) => {
  const { content, postId } = req.body
  const userId = req.user._id
  const commentData = {
    content,
    author: userId,
    postId,
  }
  const result = await CommentService.createComment(commentData)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Comment added successfully!',
    data: result,
  })
})

// get comment by post id
const getCommentByPostId = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CommentService.getCommentByPostId(id)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Post comments retrieved successfully',
    data: result,
  })
})

// update comment
const updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params
  const { content } = req.body
  const result = await CommentService.updateComment(commentId, content)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Comment updated successfully',
    data: result,
  })
})

// delete comment
const deleteComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params
  const result = await CommentService.deleteComment(postId, commentId)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Comment deleted successfully',
    data: result,
  })
})

export const CommentController = {
  createComment,
  getCommentByPostId,
  updateComment,
  deleteComment,
}