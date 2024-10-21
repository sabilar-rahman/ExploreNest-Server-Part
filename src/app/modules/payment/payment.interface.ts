import { Types } from 'mongoose'

// export type TPayment = {
//   userId: Types.ObjectId
//   transactionId: string
//   status: string
//   amount: number
// }

export type TPaymentData = {
  user: string;
  title: string;
  price: string;
  expiry: string;
  transactionId: string;
  paymentUser: TPaymentUser | null;
};


export type TPaymentUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  profileImage: string;
  status: string;
  Verified: boolean;
  address: string;
  followers: string[];
  following: string[];
};