import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.service";
import { TImageFile } from "../../interfaces/file.interface";

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUserIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.updateUserIntoDb(
    email,
    req.body,
    req.file as TImageFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user successfully!",
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const { email, role } = req.user;

  const result = await UserServices.getCurrentUser(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Current user retrieved successfully!",
    data: result,
  });
});

const toggleFollowUser = catchAsync(async (req, res) => {
  const { email } = req.user;

  const { followingId } = req.body;

  const result = await UserServices.toggleFollowUser(email, followingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User following and follower updated successfully!",
    data: result,
  });
});

const bookmarkPost = catchAsync(async (req, res) => {
  const user = await UserServices.bookmarkPost(req.body.id, req?.user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "book park added or removed successfully",
    data: user,
  });
});

const toggleStatus = catchAsync(async (req, res) => {
  const user = await UserServices.statusToggleFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Status Updated",
    data: user,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  toggleFollowUser,
  bookmarkPost,
  getSingleUser,
  toggleStatus,
};
