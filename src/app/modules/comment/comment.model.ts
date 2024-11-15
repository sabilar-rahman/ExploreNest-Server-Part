import { model, Schema, Types } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>(
  {
    post: { type: Types.ObjectId, ref: "Post", required: true },
    commenter: { type: Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Comment = model<TComment>("Comment", commentSchema);
