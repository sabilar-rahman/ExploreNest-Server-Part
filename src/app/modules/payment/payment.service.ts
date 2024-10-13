/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { join } from 'path'
import ejs from 'ejs'
import verifyPayment from './payment.utils'

import mongoose from 'mongoose'
import { Post } from '../post/post.model'
import { Payment } from './payment.model'
import { User } from '../user/user.model'

const makePayment = async (payload: any) => {
  const { data } = await axios.post(
    'https://sandbox.aamarpay.com/jsonpost.php',
    payload,
  )
  return data
}

const paymentConfirmation = async (
  transactionId: string,
  status: string,
  _id: string,
) => {
  const totalUpvotes = await Post.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(_id) } }, // Matching posts by author
    { $group: { _id: '$author', totalUpvotes: { $sum: '$upVotes' } } }, // Summing the upVotes field
  ])
  const verifyResponse = await verifyPayment(transactionId)
  if (
    verifyResponse &&
    verifyResponse.pay_status === 'Successful' &&
    totalUpvotes.length > 0
  ) {
    await User.findByIdAndUpdate(
      { _id },
      {
        verified: true,
      },
    )
    // Create a new payment record in the database
    await Payment.create({
      userId: new mongoose.Types.ObjectId(_id),
      transactionId: transactionId,
      status: 'Successful',
      amount: verifyResponse?.amount,
    })
    const successFilePath = join(__dirname, '../../../../public/success.ejs')
    const successTemplate = await ejs.renderFile(successFilePath, {
      status,
      transactionId,
      message: 'Your profile verified successfully!',
    })
    return successTemplate
  }
  if (!verifyResponse.pay_status) {
    const failedFilePath = join(__dirname, '../../../../public/failed.ejs')
    const failedTemplate = await ejs.renderFile(failedFilePath, {
      status,
      transactionId,
      message: 'Your payment failed. Please try again!',
    })
    return failedTemplate
  }
  if (totalUpvotes.length <= 0) {
    const upVoteFailedFilePath = join(
      __dirname,
      '../../../../public/upvoteFailed.ejs',
    )
    const upvoteVerificationFailedTemplate =
      ejs.renderFile(upVoteFailedFilePath)
    return upvoteVerificationFailedTemplate
  }
}

const getPaymentStats = async () => {
  const totalPayments = await Payment.countDocuments({ status: 'Successful' })
  const paymentsPerMonth = await Payment.aggregate([
    {
      $match: { status: 'Successful' },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalAmount: { $sum: '$amount' }, // Add 'amount' field to payment schema if needed
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])
  return {
    totalPayments,
    paymentsPerMonth,
  }
}

const dashboardData = async () => {
  // Count active users who have logged in within the last 30 days
  const activeUsersCount = await User.countDocuments({
    lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Past 30 days
  })
  // Sum of successful payments
  const totalPayments = await Payment.aggregate([
    { $match: { status: 'Successful' } },
    { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
  ])
  // Get the first and last date of the current month
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  )
  // Count user logins this month
  const monthlyActivity = await User.countDocuments({
    lastLogin: { $gte: startOfMonth, $lte: endOfMonth },
  })
  const monthlyPosts = await Post.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  })
  return {
    activeUsersCount,
    totalPayments,
    monthlyActivity,
    monthlyPosts,
  }
}

export const PaymentService = {
  makePayment,
  paymentConfirmation,
  getPaymentStats,
  dashboardData,
}