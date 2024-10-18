/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

const makePaymentIntoDB = async (payload: any) => {
  const { data } = await axios.post(
    'https://sandbox.aamarpay.com/jsonpost.php',
    payload,
  )
  return data
}

const paymentConfirmationIntoDB = async (
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
    // const failedFilePath = join(__dirname, '../../../../public/failed.ejs')
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


// const paymentConfirmationIntoDB = async (transactionId:string, status:string, _id:string) => {
//   try {
//     // Fetch upvotes for the user
//     const totalUpvotes = await Post.aggregate([
//       { $match: { author: new mongoose.Types.ObjectId(_id) } },
//       { $group: { _id: '$author', totalUpvotes: { $sum: '$upVotes' } } }
//     ]);

//     console.log('Total Upvotes:', totalUpvotes);

//     // Verify the payment with the payment gateway
//     const verifyResponse = await verifyPayment(transactionId);
//     console.log('Verify Payment Response:', verifyResponse);

//     if (verifyResponse && verifyResponse.pay_status === 'Successful' && totalUpvotes.length > 0) {
//       // Update user verification status
//       await User.findByIdAndUpdate({ _id }, { verified: true });

//       // Record payment in the database
//       await Payment.create({
//         userId: new mongoose.Types.ObjectId(_id),
//         transactionId: transactionId,
//         status: 'Successful',
//         amount: verifyResponse?.amount,
//       });

//       const successFilePath = join(__dirname, '../../../../public/success.ejs')
//       // Render the success template
//       return await ejs.renderFile(successFilePath, { status, transactionId, message: 'Your profile verified successfully!' });
//     }

//     if (!verifyResponse.pay_status) {
//       // Render failed template
//       const failedFilePath = join(__dirname, '../../../../public/failed.ejs')
//       return await ejs.renderFile(failedFilePath, { status, transactionId, message: 'Your payment failed. Please try again!' });
//     }

//     if (totalUpvotes.length <= 0) {
//       // Render insufficient upvotes template
//       const upVoteFailedFilePath = join(   __dirname, '../../../../public/upvoteFailed.ejs' )
//       return await ejs.renderFile(upVoteFailedFilePath, { status, transactionId, message: 'Insufficient upvotes for verification!' });
//     }
//   } catch (error) {
//     console.error('Error during payment confirmation:', error);
//     return 'An error occurred during payment confirmation. Please try again later.';
//   }
// };




const getPaymentStatsFromDB = async () => {
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

const dashboardDataFromBD = async () => {
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
  makePaymentIntoDB,
  paymentConfirmationIntoDB,
  getPaymentStatsFromDB,
  dashboardDataFromBD,
}




// // import { User } from "../User/user.model";
// // import Payment from "./payment.model";
// import { initialPayment, verifyPayment } from "./payment.utils";

// import AppError from "../../errors/AppError";
// import httpStatus from "http-status";
// // import { v4 as uuidv4 } from "uuid";

// import QueryBuilder from "../../builder/QueryBuilder";
// import { Post } from "../post/post.model";
// import { TPayment } from "./payment.interface";
// import { User } from "../user/user.model";
// import { Payment } from "./payment.model";
// import { get } from "http";

// import crypto from 'crypto'


// // export const generateUniqueId = async () => {
// //   const now = new Date();
// //   const year = now.getFullYear();
// //   const month = String(now.getMonth() + 1).padStart(2, "0");

// //   const timestamp = Date.now();

// //   const generateRandomString = (length: number): string => {
// //     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
// //     let result = "";
// //     for (let i = 0; i < length; i++) {
// //       const randomIndex = Math.floor(Math.random() * characters.length);
// //       result += characters[randomIndex];
// //     }
// //     return result;
// //   };

// //   const randomString = generateRandomString(6);

// //   const uniqueId = `Fa-${year}${month}-${timestamp}-${randomString}`;

// //   return uniqueId;
// // };

// const makePayment = async (
//   payload: Omit<TPayment, "transactionId">,
//   userId: string
// ) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User is not found");
//   }

//   const post = await Post.find({ author: user._id });






//   // Generate a transition ID
//   // const transactionId = uuidv4();
 


//   // Generate a unique transaction ID using your generateUniqueId function
//   const transactionId = crypto.randomBytes(16).toString('hex')


//   const paymentData = { ...payload, transactionId };

//   // Make the initial payment request
//   const paymentResponse = await initialPayment(paymentData);

//   if (!paymentResponse) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Payment initiation failed");
//   }

//   // Save payment data to the database
//   const result = await Payment.create({ ...paymentData, user: userId });

//   return {
//     paymentResponse,
//     result,
//   };
// };

// const paymentConfirmation = async (
//   transactionId: string,
//   status: string,
//   userId: string
// ) => {
//   let paymentStatus = "failed";
//   let message = "Payment Failed. Please try again.";

//   if (status === "success") {
//     const verifyResponse = await verifyPayment(transactionId);

//     if (verifyResponse && verifyResponse.pay_status === "Successful") {
//       await User.findByIdAndUpdate(userId, { verified: true }, { new: true });

//       const updatedPayment = await Payment.findOneAndUpdate(
//         { transactionId },
//         { status: "Paid" },
//         { new: true }
//       );

//       if (!updatedPayment) {
//         throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
//       }

//       paymentStatus = "success";
//       message =
//         "Thank you for upgrading to premium access.Your transaction <br /> has been completed successfully!";
//     }
//   }

//   // Return the HTML for both success and failed cases
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Payment ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</title>
//       <style>
//           body {
//               font-family: 'Arial', sans-serif;
//               background-color: #ffffff;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: auto;
//               width:100%;
//           }
//           .container {
//               background-color: #fff0f6;
//               padding: 50px;
//               border-radius: 10px;
//               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//               text-align: center;
//           }
//           .container h1 {
//               color: ${paymentStatus === "success" ? "#FF69B4" : "#F25081"};
//               font-size: 20px;
//               margin-bottom: 20px;
//           }
//           .container p {
//               color: #333;
//               font-size: 1.1rem;
//               margin-bottom: 30px;
//           }
//           .icon {
//               font-size: 4rem;
//               color: ${paymentStatus === "success" ? "#FF69B4" : "#F25081"};
//               margin-bottom: 20px;
//           }
//           .button {
//               display: inline-block;
//               background-color: ${paymentStatus === "success" ? "#FF69B4" : "#F25081"};
//               color: #ffffff;
//               padding: 15px 30px;
//               text-decoration: none;
//               border-radius: 30px;
//               font-size: 1rem;
//               transition: background-color 0.3s ease;
//           }
//           .button:hover {
//               background-color: ${paymentStatus === "success" ? "#FF85B2" : "#FF4588"};
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="success-icon"><img src="${paymentStatus === "success" ? "https://img.icons8.com/?size=100&id=123575&format=png&color=F25081" : "https://img.icons8.com/?size=100&id=35879&format=png&color=F25081"}" /></div>
//           <h1>${message}</h1>
//           <a href="${process.env.CLIENT_URL}" class="button">Go Back</a>
//       </div>
//   </body>
//   </html>
//   `;
// };

// const getPaymentStats = async (query: Record<string, any>) => {
//   const paymentQueryBuilder = new QueryBuilder(
//     Payment.find().populate("user"),
//     query
//   )
//     .filter()
//     .sort()
//     .paginate();

//   const result = await paymentQueryBuilder.modelQuery;
//   const meta = await paymentQueryBuilder.countTotal();

//   return {
//     meta,
//     result,
//   };
// };

// const dashboardData = async () => {
//   const result = await Payment.find().populate("user");

//   return result;
// };

// export const PaymentService = {
//   makePayment,
//   paymentConfirmation,
//   getPaymentStats,
//   dashboardData,
// };