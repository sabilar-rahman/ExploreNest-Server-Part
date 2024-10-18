

/*
import catchAsync from '../utils/catchAsync'
import sendResponse from '../utils/sendResponse'
import { PostService } from './post.service'

const createPost = catchAsync(async (req, res) => {
  const result = await PostService.createPostIntoDB(req.body)
  sendResponse(res, {
    success: true,
    message: 'post has been created successfully!',
    statusCode: 200,
    data: result,
  })
})

const getUserPost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostService.getUserSinglePost(id)
  sendResponse(res, {
    success: true,
    message: 'post has been retrieved successfully!',
    statusCode: 200,
    data: result,
  })
})

const getAllPost = catchAsync(async (req, res) => {
  const user = req.user
  const query = req.query
  const result = await PostService.getAllPost(query, user)
  sendResponse(res, {
    success: true,
    message: 'posts has been retrieved successfully!',
    statusCode: 200,
    data: result,
  })
})

const getAllPostsForTable = catchAsync(async (req, res) => {
  const result = await PostService.getAllPostsForTable()
  sendResponse(res, {
    success: true,
    message: 'posts has been retrieved successfully!',
    statusCode: 200,
    data: result,
  })
})

// get post by id
const getPostById = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const result = await PostService.getPostById(postId)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Post retrieved successfully!',
    data: result,
  })
})

const upVotes = catchAsync(async (req, res) => {
  const userId = req.user._id
  const postId = req.params.id
  const result = await PostService.upVotes(userId, postId)
  sendResponse(res, {
    success: true,
    message: 'You have made a up vote!',
    statusCode: 200,
    data: result,
  })
})

const downVotes = catchAsync(async (req, res) => {
  const userId = req.user._id
  const postId = req.params.id
  const result = await PostService.downVotes(userId, postId)
  sendResponse(res, {
    success: true,
    message: 'You have made a down vote!',
    statusCode: 200,
    data: result,
  })
})

//update post
const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostService.updatePostIntoDB(id, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'post updated successfully',
    data: result,
  })
})

//delete post
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostService.deletePostFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'post deleted successfully',
    data: result,
  })
})

export const PostController = {
  createPost,
  getUserPost,
  getAllPost,
  upVotes,
  downVotes,
  getPostById,
  getAllPostsForTable,
  updatePost,
  deletePost,
}

*/


import httpStatus from "http-status";
import { PostServices } from "./post.service";
import sendResponse from "../utils/sendResponse";
import catchAsync from "../utils/catchAsync";

// import { TImageFiles } from "../../interfaces/file.interface";

// const createPost = catchAsync(async (req, res) => {
//   const post = await PostServices.createPostIntoDb(
//     req.body,
//     req.files as TImageFiles,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Post Created Successfully",
//     data: post,
//   });
// });


const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDB(req.body)
  sendResponse(res, {
    success: true,
    message: 'post has been created successfully!',
    statusCode: 200,
    data: result,
  })
})

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

// const updatePost = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const updatedItem = await PostService.updatePostIntoDB(
//     id,
//     req.body,
//     req.files as TImageFiles,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Post updated successfully",
//     data: updatedItem,
//   });
// });

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostServices.updatePostIntoDB(id, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'post updated successfully',
    data: result,
  })
})

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

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  votePost,
  getCurrentUserPost,
};