// import { Types } from 'mongoose'

// export type TPayment = {
//   userId: Types.ObjectId
//   transactionId: string
//   status: string
//   amount: number
// }

// export type TPaymentData = {
//   user: string;
//   status: "Active" | "Expired";
//   transactionId: string;
//   paymentUser: TPaymentUser | null;
// };


// export type TPaymentUser = {
//   _id?: string;
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   profileImage: string;
//   status: string;
//   verified: boolean;
//   address: string;
//   followers: string[];
//   following: string[];
// };



import { Types } from "mongoose";
export interface TPaymentInfo {
  user: Types.ObjectId;
  transactionId: string
  amount?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  paidStatus?: "Un-Paid" | "Paid"
}