import mongoose, { Schema } from 'mongoose'
import { TPayment } from './payment.interface'

const paymentSchema = new Schema<TPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Payment = mongoose.model<TPayment>('payment', paymentSchema)