import mongoose, { Schema } from 'mongoose'
import { TComment } from './comment.interface'

const commentSchema = new Schema<TComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    feedback: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

// Create the Comment model
const Comment = mongoose.model<TComment>('Comment', commentSchema)

export default Comment