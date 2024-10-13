import { Types } from 'mongoose'

export type TComment = {
  content: string
  author: Types.ObjectId
  postId: Types.ObjectId
}







