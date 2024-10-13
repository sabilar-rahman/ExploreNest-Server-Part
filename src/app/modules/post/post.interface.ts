import { Types } from 'mongoose'
import { TComment } from '../comment/comment.interface'

interface Voter {
  user: Types.ObjectId
  vote: 'upvote' | 'downvote'
}

export type TPost = {
  author: Types.ObjectId
  title: string
  content?: string
  category: string
  image?: string
  comments: [TComment]
  upVotes: number
  downVotes: number
  voters: Voter[]
  premium?: boolean
  createdAt?: Date;
  updatedAt?: Date;
  

}