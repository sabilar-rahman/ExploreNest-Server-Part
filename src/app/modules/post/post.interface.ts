import mongoose, { ObjectId } from "mongoose";
import { POST_CATEGORY } from "./post.constant";

export type TPost = {
  _id?: string;
  title: string;
  location: string;
  description: string;
  content?: string;
  author: ObjectId;
  images?: string[];
  category: keyof typeof POST_CATEGORY;
  upvote: mongoose.Types.ObjectId[];
  downvote: mongoose.Types.ObjectId[];
  commentCount: number;
  isPremium: boolean;
  isDelete: boolean;
};
