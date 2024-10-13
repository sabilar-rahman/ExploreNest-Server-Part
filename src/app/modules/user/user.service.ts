import { Types } from 'mongoose'
import { Booking } from '../booking/booking.model'
import { TUser } from './user.interface'
import { User } from './user.model'

const createUserIntoDb = async (userData: TUser) => {
  const result = await User.create(userData)
  return result
}

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}
// const getUserFromDB = async (email: string) => {
//   const result = await User.findOne({ email })
//   return result
// }

const getUserFromDB = async (email: string) => {
  const result = await User.findOne({ email }).populate(
    'following followers',
    '_id name image',
  )
  return result
}



const getMyBookingsFromDb = async (email: string) => {
  // const result = await Booking.find().populate('customer')
  const user = await User.findOne({ email })
  if (user) {
    const result = await Booking.find({
      // customer: user._id,
      status: { $ne: 'pending' },
    })
      .populate('service', '_id name description price duration')
      .populate('slot', '_id service date startTime endTime isBooked')
      .select('-customer')
      .sort({ createdAt: -1 })
      .lean()
    return result
  }
}










type FollowPayload = {
  userId: string // Assuming you're passing userId and targetedId as strings
  targetedId: string
}

const followUser = async (payload: FollowPayload) => {
  const { userId, targetedId } = payload

  // Convert string IDs to ObjectId
  const userObjectId = new Types.ObjectId(userId)
  const targetedObjectId = new Types.ObjectId(targetedId)

  const targetedUser = await User.findById(targetedObjectId)
  if (!targetedUser) {
    throw new Error('User not found')
  }

  const isFollowing = targetedUser.followers.includes(userObjectId)

  if (isFollowing) {
    await User.findByIdAndUpdate(userObjectId, {
      $pull: { following: targetedObjectId },
    })
    await User.findByIdAndUpdate(targetedObjectId, {
      $pull: { followers: userObjectId },
    })
    return  'Unfollow successfully' 
  } else {
    await User.findByIdAndUpdate(userObjectId, {
      $push: { following: targetedObjectId },
    })
    await User.findByIdAndUpdate(targetedObjectId, {
      $push: { followers: userObjectId },
    })
    return  'Followed successfully' 
  }
}








const getFollowersFromDB = async (id: string) => {
  // Find the user by ID and populate the followers field
  const userWithFollowers = await User.findById(id)
    .populate('followers', 'name email image') // Specify the fields you want from the follower
    .select('followers')

  if (!userWithFollowers) {
    throw new Error('User not found')
  }
  return userWithFollowers
}
const getFollowingFromDB = async (id: string) => {
  // Find the user by ID and populate the followers field
  const userWithFollowing = await User.findById(id)
    .populate('following', 'name email image') // Specify the fields you want from the follower
    .select('followers')

  if (!userWithFollowing) {
    throw new Error('User not found')
  }
  return userWithFollowing
}






const updateUserRoleIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}



const getUserByIdFromDB = async (id: string) => {
  const result = await User.findById(id).populate(
    'following followers',
    '_id name image',
  )
  if (!result) {
    throw new Error('User not found!')
  }
  return result
}









export const userServices = {
  createUserIntoDb,
  getMyBookingsFromDb,
  getUserFromDB,
  updateUserIntoDB,
  followUser,

  getFollowersFromDB,
  getFollowingFromDB,



  updateUserRoleIntoDB,



  getUserByIdFromDB

}