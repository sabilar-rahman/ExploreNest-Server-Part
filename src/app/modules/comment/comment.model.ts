import mongoose, { Schema } from 'mongoose'
import { TComment } from './comment.interface'

const commentSchema = new Schema<TComment>(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true },
)

export const Comment = mongoose.model<TComment>('Comment', commentSchema)