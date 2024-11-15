import mongoose, { model, Schema, Types } from "mongoose";
import { TPost } from "./post.interface";
import { POST_CATEGORY } from "./post.constant";

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: Object.values(POST_CATEGORY),
      required: true,
    },
    upvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<TPost>("Post", postSchema);
