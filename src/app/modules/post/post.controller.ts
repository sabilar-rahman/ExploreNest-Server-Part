import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import { TImageFiles } from "../../interfaces/file.interface";

const createPost = catchAsync(async (req, res) => {
  const post = await PostServices.createPostIntoDb(
    req.body,
    req.files as TImageFiles,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Created Successfully",
    data: post,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const post = await PostServices.getAllPostsFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: post,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const post = await PostServices.getPostByFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedItem = await PostServices.updatePostIntoDB(
    id,
    req.body,
    req.files as TImageFiles,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: updatedItem,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PostServices.deletePostIntoDb(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

const votePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { action } = req.body;

  const { email } = req.user;

  const result = await PostServices.votePostIntoDB(id, action, email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post upvote or downvote added successfully",
    data: result,
  });
});

const getCurrentUserPost = catchAsync(async (req, res) => {
  const result = await PostServices.getCurrentUserPost(req?.user?._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Current user post retrieved successfully",
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  votePost,
  getCurrentUserPost,
};
