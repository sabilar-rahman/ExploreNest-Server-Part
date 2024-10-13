import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import sendResponse from '../utils/sendResponse'
import { commentServices } from './comment.service'
import { getUserInfoFromToken } from '../utils/getUserInfoFromToken';


// comment
const postComment = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const result = await commentServices.commentIntoPost(id, payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commented successfully',
    data: result,
  })
});


const getAllCommentsByPost = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await commentServices.getCommentsByPostFromDB(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment retrieved successfully',
      data: result,
    })
  })




const editPostComment = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const result = await commentServices.EditCommentIntoPost(id, payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  })
})




const deleteComment = catchAsync(async (req, res) => {
    const token = req.headers.authorization
    const { id: userId } = getUserInfoFromToken(token as string)
    const { id } = req.params
    // console.log(userId, id)
    const result = await commentServices.deleteCommentFromDB(id, userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment deleted successfully',
      data: result,
    })
  })






  

export const commentControllers = {
  postComment,
  editPostComment,
  getAllCommentsByPost,
  deleteComment
}