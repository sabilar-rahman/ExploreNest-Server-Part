import mongoose, { Schema } from "mongoose";
import { TComment, TPost } from "./post.interface";

// Comment Schema
const CommentSchema: Schema = new Schema<TComment>(
  {
    commenter: { type: Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PostSchema: Schema = new Schema<TPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String ,required: false },
    tags: { type: String, enum: ["premium", "basic"], required: true },
    // upVotes: { type: Number, default: 0 },
    // downVotes: { type: Number, default: 0 },
    upVotes: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    downVotes: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],

    comments: [CommentSchema],
    commentsCount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    category: {
      type: String,
      enum: [
        "adventure",
        "business trip",
        "exploration",
        "historical",
        "beach",
        "mountain",
      ],
      default: "adventure",
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Create the Post model
const Post = mongoose.model<TPost>("Post", PostSchema);

export default Post;
