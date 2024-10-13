import { Types } from 'mongoose'

export type TPayment = {
  userId: Types.ObjectId
  transactionId: string
  status: string
  amount: number
}