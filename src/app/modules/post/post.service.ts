/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'

import { TPost } from './post.interface'
import { Post } from './post.model'

import { User } from '../user/user.model'
import { searchableFields } from '../utils/searchFields'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'



// create post
const createPostIntoDB = async (payload: TPost) => {
  const result = (
    await (await Post.create(payload)).populate('author')
  ).populate('comments')
  return result
}

// get specific user post
const getUserSinglePost = async (id: string) => {
  const result = await Post.find({ author: id })
    .populate('author')
    .sort({ createdAt: -1 })
  return result
}

// get all post
const getAllPost = async (query: Record<string, unknown>, user: any) => {
  const findUser = await User.findOne({ email: user?.email })
  const userVerified = findUser?.verified
  // Initialize the query
  let postQuery: any = Post.find()

  // If the user is not verified, filter out premium posts
  if (!userVerified) {
    postQuery = postQuery.where({ premium: false })
  }
  const postQueryBuilder = new QueryBuilder(Post.find(), query)
    .search(searchableFields) // Specify the searchable fields
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await postQueryBuilder.modelQuery
    .populate('author')
    .populate('comments')
    .exec()

  // Get total post count and pagination details
  const { total, totalPage, page, limit } = await postQueryBuilder.countTotal()
  return {
    posts: result,
    totalPages: totalPage,
    currentPage: page,
    totalPosts: total,
    limit,
  }
}

//get all posts
const getAllPostsForTable = async () => {
  const result = await Post.find({}).populate('author')
  return result
}

// get post by
const getPostById = async (postId: string) => {
  const result = await Post.findById({ _id: postId }).populate('author')
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upVotes = async (userId: any, postId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!')
  }

  // Check if user has already voted
  const existingVote = post.voters.find(
    voter => String(voter.user) === String(userId),
  )

  if (existingVote) {
    if (existingVote.vote === 'upvote') {
      // User already upvoted, so remove the upvote
      post.upVotes -= 1
      post.voters = post.voters.filter(
        voter => String(voter.user) !== String(userId),
      )
    } else if (existingVote.vote === 'downvote') {
      // User had downvoted, so switch to upvote
      post.downVotes -= 1
      post.upVotes += 1
      existingVote.vote = 'upvote'
    }
  } else {
    // User has not voted, so add an upvote
    post.upVotes += 1
    post.voters.push({ user: userId, vote: 'upvote' })
  }

  const result = await post.save()
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downVotes = async (userId: any, postId: string) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!')
  }
  // Check if user has already voted
  const existingVote = post.voters.find(
    voter => String(voter.user) === String(userId),
  )

  if (existingVote) {
    if (existingVote.vote === 'downvote') {
      // User already downvoted, so remove the downvote
      post.downVotes -= 1
      post.voters = post.voters.filter(
        voter => String(voter.user) !== String(userId),
      )
    } else if (existingVote.vote === 'upvote') {
      // User had upvoted, so switch to downvote
      post.upVotes -= 1
      post.downVotes += 1
      existingVote.vote = 'downvote'
    }
  } else {
    // User has not voted, so add a downvote
    post.downVotes += 1
    post.voters.push({ user: userId, vote: 'downvote' })
  }

  const result = await post.save()
  return result
}

//update service
const updatePostIntoDB = async (id: string, payload: Partial<TPost>) => {
  const service = await Post.findById(id)
  //check isService exists
  if (!service) {
    throw new AppError(404, 'Service not found!')
  }

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

//delete service
const deletePostFromDB = async (id: string) => {
  const service = await Post.findById(id)
  //check isService exists
  if (!service) {
    throw new AppError(404, 'Service not found!')
  }
  const result = await Post.findByIdAndDelete(id)
  return result
}

export const PostService = {
  createPostIntoDB,
  getUserSinglePost,
  getAllPost,
  upVotes,
  downVotes,
  getPostById,
  getAllPostsForTable,
  updatePostIntoDB,
  deletePostFromDB,
}