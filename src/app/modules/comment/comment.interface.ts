import { ObjectId } from "mongoose";

export type TComment = {
  _id?: string;
  post: ObjectId;
  commenter: ObjectId;
  comment: string;
};
