// import mongoose, { Schema } from 'mongoose'
// import { TPayment } from './payment.interface'

// const paymentSchema = new Schema<TPayment>(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     transactionId: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// export const Payment = mongoose.model<TPayment>('payment', paymentSchema)

// import mongoose, { model, Schema } from "mongoose";
// import { TPaymentData } from "./payment.interface";


// const PaymentSchema = new Schema<TPaymentData>(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["Active", "Expired"],
//       default: "Active",
//     },
//     transactionId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     planTitle: {
//       type: String,
//       required: true,
//     },
//     planPrice: {
//       type: Number,
//       required: true,
//     },
//     expiryDate: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Payment = model<TPayment>("Payment", PaymentSchema);

import { model, Schema } from "mongoose";
import { TPaymentInfo } from "./payment.interface"; // Adjust the path as necessary

const PaymentInfoSchema = new Schema<TPaymentInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: false,
    },
    customerEmail: {
      type: String,
      required: false,
    },
    customerPhone: {
      type: String,
      required: false,
    },
    customerAddress: {
      type: String,
      required: false,
    },
    paidStatus: {
      type: String,
       enum:["Un-Paid", "Paid"],// ["Pending", "Completed", "Failed"],  Adjust enum values as needed
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentInfo = model<TPaymentInfo>("PaymentInfo", PaymentInfoSchema);
