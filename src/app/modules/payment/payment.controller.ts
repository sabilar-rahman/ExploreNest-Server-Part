import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Created Successfully",
    data: result,
  });
});

// const confirmationController = catchAsync(async (req, res) => {
//   const { transactionId, payload } = req.query;
//   const result = await PaymentServices.confirmationService(
//     transactionId as string,
//     payload as string,
//   );

//   res.send(result);
// });


const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;
  const result = await PaymentServices.confirmationService(transactionId as string,status as string);
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



// import httpStatus from "http-status";

// import { PaymentServices } from "./payment.service";
// import { catchAsync } from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";



// const createPayment = catchAsync(async (req, res) => {
//   const { userId } = req.params;
//   const result = await PaymentServices.createPaymentIntoDB(req.body , userId as string);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Payment Created Successfully",
//     data: result,
//   });
// });

// const confirmationController = catchAsync(async (req, res) => {
//   const { transactionId, payload } = req.query;
//   const { userId } = req.params;

//   const result = await PaymentServices.confirmationService(
//     transactionId as string,
//     payload as string,
//     userId as string
//   );

//   res.send(result);
// });

// const getAllPayments = catchAsync(async (req, res) => {
  
//   const payments = await PaymentServices.getAllPaymentsFromDB();

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Payments fetched successfully",
//     data: payments,
//   });
// });

// export const PaymentController = {
//   createPayment,
//   confirmationController,
//   getAllPayments,
// };