// import mongoose, { Schema } from "mongoose";
// import { TComment } from "./comment.interface";

// const commentSchema = new Schema<TComment>(
//   {
//     commenter: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     post: { type: mongoose.Schema.Types, ref: "Post", required: true },

//     // postId: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: 'Post',
//     //   required: true,
//     // },

//     comment: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export const Comment = mongoose.model<TComment>("Comment", commentSchema);


import mongoose, { Schema } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>(
  {
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, // Correct the type here
      ref: "Post", 
      required: true 
    },
    comment: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<TComment>("Comment", commentSchema);