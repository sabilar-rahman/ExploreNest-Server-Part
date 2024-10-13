import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../config'
import { UserSearchableFields } from './user.constant'
import { IUser } from './user.interface'
import { User } from './user.model'
import bcryptJs from 'bcryptjs'
const createUser = async (user: IUser) => {
  user.password = await bcryptJs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  return await User.create(user)
}

const findUserById = async (userId: string) => {
  return await User.findById(userId)
}
const findUserFromDBByEmail = async (email: string) => {
  return await User.findOne({ email })
}

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await userQuery.modelQuery
  const metaData = await userQuery.countTotal()
  return {
    meta: metaData,
    data: result,
  }
}

const updateUserById = async (userId: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteUserById = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId)
  return result
}

// follow user
const followUser = async (userId: string, currentUserId: string) => {
  // Add the followed user's ID to the current user's following list
  await User.findByIdAndUpdate(currentUserId, {
    $addToSet: { following: userId },
  })

  // Add the current user's ID to the followed user's followers list
  await User.findByIdAndUpdate(userId, {
    $addToSet: { followers: currentUserId },
  })
}
// unFollow user
const unFollowUser = async (userId: string, currentUserId: string) => {
  // Remove the unfollowed user's ID from the current user's following list
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { following: userId },
  })

  // Remove the current user's ID from the unfollowed user's followers list
  await User.findByIdAndUpdate(userId, {
    $pull: { followers: currentUserId },
  })
}

const updateUserRoleIntoDB = async (id: string) => {
  const res = await User.findByIdAndUpdate(
    id,
    {
      role: 'admin',
    },
    { new: true, runValidators: true },
  )
  return res
}

export const UserService = {
  createUser,
  findUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  findUserFromDBByEmail,
  followUser,
  unFollowUser,
  updateUserRoleIntoDB,
}