import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
import { Post } from "../post/post.model";
import { TImageFile } from "../../interfaces/file.interface";

const createUserIntoDb = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDb = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserIntoDb = async (
  email: string,
  payload: Partial<TUser>,
  image: TImageFile,
) => {
  // check if the user exists in the database
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is blocked by the admin
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // if there is an image, update the profileImage field
  if (image && image.path) {
    payload.profileImage = image.path;
  }

  const result = await User.findByIdAndUpdate(user?._id, payload, {
    new: true,
  });

  return result;
};

const getCurrentUser = async (userEmail: string, userRole: string) => {
  const result = await User.findOne({ email: userEmail, role: userRole })
    .select("-password")
    .populate({
      path: "bookmarkPosts",
      populate: {
        path: "author",
        select: "-password",
      },
    })
    .populate("following")
    .populate("followers");

  return result;
};

const toggleFollowUser = async (userEmail: string, followingId: string) => {
  // checking if the user is exist in the database
  const follower = await User.isUserExistsByEmail(userEmail);
  const following = await User.findById(followingId);

  if (!following || !follower) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (following?.status === "BLOCKED" || follower?.status === "BLOCKED") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked!");
  }

  const isFollowing = following?.followers?.includes(
    new mongoose.Types.ObjectId(follower?._id),
  );

  if (isFollowing) {
    // unFollow the user
    await User.findByIdAndUpdate(
      follower?._id,
      { $pull: { following: following?._id } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      following?._id,
      { $pull: { followers: follower?._id } },
      { new: true },
    );

    return null;
  } else {
    // follow the user
    await User.findByIdAndUpdate(
      follower?._id,
      { $addToSet: { following: following?._id } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      following?._id,
      { $addToSet: { followers: follower?._id } },
      { new: true },
    );

    return null;
  }
};

const bookmarkPost = async (id: string, userOwnId: string) => {
  const postId = new mongoose.Types.ObjectId(id);
  const userId = new mongoose.Types.ObjectId(userOwnId);

  const isPostExist = await Post.findById(postId);
  const isUserExist = await User.findById(userId);

  if (!isPostExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Not found");
  }

  const bookmarkPostExist = isUserExist?.bookmarkPosts?.includes(postId);

  if (bookmarkPostExist) {
    await User.findByIdAndUpdate(userId, { $pull: { bookmarkPosts: id } });
  } else {
    await User.findByIdAndUpdate(userId, { $push: { bookmarkPosts: id } });
  }
};

const statusToggleFromDB = async (id: string) => {
  const findUser = await User.findById(id);

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const checkStatusOfUser = findUser.status;

  if (checkStatusOfUser === "ACTIVE") {
    await User.findByIdAndUpdate({ _id: id }, { status: "BLOCKED" });
  } else {
    await User.findByIdAndUpdate({ _id: id }, { status: "ACTIVE" });
  }
};

export const UserServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  getCurrentUser,
  updateUserIntoDb,
  toggleFollowUser,
  bookmarkPost,
  getSingleUserFromDB,
  statusToggleFromDB,
};
