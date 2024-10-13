import httpStatus from "http-status";

import { TPost } from "./post.interface";
// import { TImageFiles } from "../../interface/image.interface";
import { postServices } from "./post.service";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import Post from "./post.model";
import { getUserInfoFromToken } from "../utils/getUserInfoFromToken";
import { TImageFile } from "../../interface/image.interface";

// const createPost = catchAsync(async (req, res) => {
//   const postInfo = req.body;
//   const files = req.files as TImageFiles;
//   const postImages = files?.image;

//   const postData: TPost = {
//     ...postInfo,
//     image: postImages.map((image) => image.path),
//   };

//   const result = await postServices.createPostIntoDB(postData);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Post created successfully",
//     data: result,
//   });
// });






// const getAllPosts = catchAsync(async (req, res) => {
//   const result = await postServices.getAllPostsFromDB();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Post retrieved successfully",
//     data: result,
//   });
// });


const createPost = catchAsync(async (req, res) => {
    const postInfo = req.body
    
    const file = req.file as TImageFile
    const imagePath = file?.path
    const payload = {
      ...postInfo,
      
      image: imagePath,
    }
  
    
    const result = await postServices.createPostIntoDB(payload)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Post created successfully',
      data: result,
    })
  })

const getAllPosts = catchAsync(async (req, res) => {
    
    const query = req.query
    const result = await postServices.getAllPostsFromDB(query)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Posts retrieved successfully',
      data: result,
    })
  })
  const getPostsByAuthor = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await postServices.getPostsByAuthorFromDB(id)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Posts retrieved successfully',
      data: result,
    })
  })










const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.getSinglePostFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

// const updatePost = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const postInfo = req.body;

//   const files = req.files as TImageFiles;
//   const postImages = files?.image;

//   const payload: Partial<TPost> = {
//     ...postInfo,
//     ...(postImages ? { image: postImages } : {}),
//   };

//   const result = await postServices.updatePostIntoDB(id, payload);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Post updated successfully",
//     data: result,
//   });
// });





const updatePost = catchAsync(async (req, res) => {
    const { id } = req.params
    const postInfo = req.body
  
    const file = req.file as TImageFile
    const imagePath = file?.path
  
    const payload: Partial<TPost> = {
      ...postInfo,
      ...(imagePath ? { image: imagePath } : {}),
    }
  
    const result = await postServices.updatePostIntoDB(id, payload)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Post updated successfully',
      data: result,
    })
  })
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Post.findByIdAndDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});







// upvote and downvote

const upVotePost = catchAsync(async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization
    const { id: userId } = getUserInfoFromToken(token as string)
    const result = await postServices.upVotePostIntoDB(id, userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Voted done successfully',
      data: result,
    })
  })
  const downVotePost = catchAsync(async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization
    const { id: userId } = getUserInfoFromToken(token as string)
    const result = await postServices.downVotePostIntoDB(id, userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Vote removed successfully',
      data: result,
    })
  })






  const getPopularPosts = catchAsync(async (req, res) => {
    const result = await Post.find()
      .sort({ upVotes: -1 })
      .limit(5)
      .populate('author', '_id name image')
      .select({
        image: 0,
        downVotes: 0,
        commentsCount: 0,
        category: 0,
        comments: 0,
      })
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Top posts retrieved successfully',
      data: result,
    })
  })







//   active and inactive

const getAllAcInacPosts = catchAsync(async (req, res) => {
    const result = await Post.find()
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Posts retrieved successfully',
      data: result,
    })
  })



export const postControllers = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,



  upVotePost,
  downVotePost,


  getPopularPosts,

  getPostsByAuthor,




  getAllAcInacPosts



};
