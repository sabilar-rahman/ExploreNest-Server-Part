import mongoose, { Schema } from "mongoose";
import { TPost } from "./post.interface";

const postSchema: Schema<TPost> = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    // image: String,

    image: { type: [String], default: [] },

    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    // upVotes: { type: Number, default: 0 },
    // downVotes: { type: Number, default: 0 },
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
    // voters: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     vote: { type: String, enum: ["upvote", "downvote"] }, // stores 'upvote' or 'downvote'
    //   },
    // ],

    commentCount: { type: Number, default: 0 }, // stores number of comments
    premium: { type: Boolean, default: false },

    delete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<TPost>("Post", postSchema);
