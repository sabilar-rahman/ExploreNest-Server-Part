
// import crypto from 'crypto'
// import { PaymentService } from './payment.service'
// import catchAsync from '../utils/catchAsync'
// import sendResponse from '../utils/sendResponse'


// const makePayment = catchAsync(async (req, res) => {
//   const transactionId = crypto.randomBytes(16).toString('hex')
//   const modifiedPaymentObj = {
//     cus_name: req.body.name,
//     cus_email: req.body.email,
//     cus_phone: '01720084302',
//     amount: req.body.amount,
//     tran_id: transactionId,
//     signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
//     store_id: 'aamarpaytest',
//     currency: 'BDT',
//     desc: 'Verified profile',
//     cus_add1: 'N/A',
//     cus_add2: 'N/A',
//     cus_city: 'N/A',
//     cus_country: 'Bangladesh',
//     success_url: `http://localhost:5000/api/payment/confirmation?transactionId=${transactionId}&userId=${req.body._id}&status=success`,
//     fail_url: `http://localhost:5000/api/payment/confirmation?status=failed`,
//     cancel_url: `http://localhost:3000`,
//     type: 'json',
//   }
//   const result = await PaymentService.makePaymentIntoDB(modifiedPaymentObj)
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Payment recieved successfully',
//     data: result,
//   })
// })

// const paymentConfirmation = catchAsync(async (req, res) => {
//   const result = await PaymentService.paymentConfirmationIntoDB(
//     req.query?.transactionId as string,
//     req.query?.status as string,
//     req.query?.userId as string,
//   )
//   res.send(result)
// })

// const getPaymentStats = catchAsync(async (req, res) => {
//   const result = await PaymentService.getPaymentStatsFromDB()
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Payment stats retrieved successfully',
//     data: result,
//   })
// })

// const dashboardData = catchAsync(async (req, res) => {
//   const result = await PaymentService.dashboardDataFromBD()
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Dashboard data retrieved successfully!',
//     data: result,
//   })
// })

// export const PaymentController = {
//   makePayment,
//   paymentConfirmation,
//   getPaymentStats,
//   dashboardData,
// }


import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { PaymentServices } from "./payment.service";



const createPayment = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await PaymentServices.createPaymentIntoDB(req.body , userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Created Successfully",
    data: result,
  });
});

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, payload } = req.query;
  const { userId } = req.params;

  const result = await PaymentServices.confirmationService(
    transactionId as string,
    payload as string,
    userId as string
  );

  res.send(result);
});

const getAllPayments = catchAsync(async (req, res) => {
  
  const payments = await PaymentServices.getAllPaymentsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments fetched successfully",
    data: payments,
  });
});

export const PaymentController = {
  createPayment,
  confirmationController,
  getAllPayments,
};