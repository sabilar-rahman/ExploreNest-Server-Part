/* eslint-disable no-undef */
import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { TUser } from "./user.interface";
import { getUserInfoFromToken } from "../utils/getUserInfoFromToken";
import { User } from "./user.model";
import Post from "../post/post.model";

const createUser = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const files = req.files as { image?: Express.Multer.File[] };
  const userImage = files?.image?.[0]?.path ;

  console.log(userInfo);
  console.log(files);


  const userData: TUser = {
    ...userInfo,
    image: userImage,
  };

  const result = await userServices.createUserIntoDb(userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await User.find();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
const getUserByEmail = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const { email } = getUserInfoFromToken(token as string);
  const result = await userServices.getUserFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await userServices.getUserByIdFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})




const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params
  const result = await userServices.getUserFromDB(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})







const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const userInfo = req.body;
  const files = req.files as { image?: Express.Multer.File[] };
  const userImage = files?.image?.[0]?.path;

  const updatedUserData: Partial<TUser> = {
    ...userInfo,
    ...(userImage ? { image: userImage } : {}),
  };

  // const payload = req.body
  const result = await userServices.updateUserIntoDB(id, updatedUserData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

// const getMyBookings = catchAsync(async (req, res) => {
//   const token = req.headers.authorization;
//   const { email } = getUserInfoFromToken(token as string);
//   const result = await userServices.getMyBookingsFromDb(email);
//   if (!result || result?.length === 0) {
//     return handleNoDataResponse(res);
//   }
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User bookings retrieved successfully",
//     data: result,
//   });
// });


const getMyBookings = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const { email } = getUserInfoFromToken(token as string); // Extract user info from token

  const result = await userServices.getMyBookingsFromDb(email); // Fetch bookings

  if (!result || result.length === 0) {
    // If no bookings found, send a custom response
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No bookings found for the user",
    });
  }

  // Send the successful response if bookings are found
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User bookings retrieved successfully",
    data: result,
  });
});






const follow = catchAsync(async (req, res) => {
  const payload = req.body
  const result = await userServices.followUser(payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})




const getFollowers = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await userServices.getFollowersFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Followers retrieved successfully',
    data: result,
  })
})
const getFollowing = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await userServices.getFollowingFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Following users retrieved successfully',
    data: result,
  })
})



// role update


const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params
  const userInfo = req.body
  console.log(id, userInfo)
  const result = await userServices.updateUserIntoDB(id, userInfo)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  })
})




// site statistics


const getSiteStatistics = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalPremiumUsers = await User.countDocuments({ status: 'premium' })
  const totalBasicUsers = await User.countDocuments({ status: 'basic' })

  const totalContents = await Post.countDocuments()
  const totalInactiveContents = await Post.countDocuments({ isActive: false })

  const result = {
    totalUsers: totalUsers,
    totalPremiumUsers: totalPremiumUsers,
    totalBasicUsers: totalBasicUsers,
    totalContents: totalContents,
    totalActiveContents: totalContents - totalInactiveContents,
    totalInactiveContents: totalInactiveContents,
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site statistics retrieved successfully',
    data: result,
  })
})

















export const userControllers = {
  createUser,
  getMyBookings,
  getAllUser,
  getUserByEmail,
  getUserById,


  updateUser,
  follow,
  getFollowing,
  getFollowers,

  getSingleUser,


  updateUserRole,




  getSiteStatistics,


};
