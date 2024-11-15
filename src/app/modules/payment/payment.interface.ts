// import mongoose from "mongoose";

// export type TPayment = {
//   user: mongoose.Types.ObjectId;
//   amount: number;
//   paymentMethod?: string;
//   status: "Active" | "Expired";
//   transactionId: string;
//   planTitle: string;
//   planPrice: number;
//   expiryDate: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export type TPaymentUser = {
//   _id?: string;
//   name: string;
//   email: string;
//   password: string;
//   mobileNumber: string;
//   gender: string;
//   role: string;
//   profileImage: string;
//   status: string;
//   isVerified: boolean;
//   birthDate: string;
//   bio: string;
//   address: string;
//   followers: string[];
//   following: string[];
//   bookmarkPosts: string[];
// };

// export type TPaymentData = {
//   user: string;
//   title: string;
//   price: string;
//   expiry: string;
//   transactionId: string;
//   paymentUser: TPaymentUser | null;
// };

// 2nd ----------

export type TPayment= {
  name: string;
  email: string;
  phoneNumber: string;
  userId: string;
  amount : string;
  transactionId : string;
  address:string;
}

// 3rd -----------


// import { Types } from "mongoose";
// export interface TPaymentInfo {
//   user: Types.ObjectId;
//   transactionId: string
//   amount?: string
//   customerName?: string
//   customerEmail?: string
//   customerPhone?: string
//   customerAddress?: string
//   paidStatus?: "Un-Paid" | "Paid"
// }