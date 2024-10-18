// import { Types } from 'mongoose'

// export type TComment = {
//   content: string
//   author: Types.ObjectId
//   postId: Types.ObjectId
// }

// import {Types} from "mongoose";

// export type TComment = {
//   _id?: string;
//   post: Types.ObjectId;
//   commenter: Types.ObjectId;
//   comment: string;
// };


import mongoose from "mongoose";

export type TComment = {
  _id?: string;
  post: mongoose.Types.ObjectId;
  commenter: mongoose.Types.ObjectId;
  comment: string;
};




