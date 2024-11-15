// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { join } from "path";
// import { User } from "../user/user.model";
// import { TPayment, TPaymentData } from "./payment.interface";
// import { Payment } from "./payment.model";
// import {
//   calculateExpiryDate,
//   generateUniqueId,
//   initiatePayment,
//   verifyPayment,
// } from "./payment.utils";
// import { readFileSync } from "fs";
// import AppError from "../../errors/AppError";
// import httpStatus from "http-status";

// const createPaymentIntoDB = async (body: TPayment) => {
//   const isUserExist = await User.findById(body.user);

//   const newId = await generateUniqueId();
//   if (isUserExist && newId) {
//     const paymentData: any = {
//       ...body,
//       transactionId: newId,
//       paymentUser: isUserExist,
//     };

//     const paymentSession = await initiatePayment(paymentData);
//     return paymentSession;
//   }
// };

// const confirmationService = async (
//   transactionId?: string | undefined,
//   payload?: string | undefined,
// ) => {
//   let message = "";
//   let parsedPayload;

//   try {
//     const res = await verifyPayment(transactionId);

//     try {
//       parsedPayload = JSON.parse(payload || "{}");
//     } catch (error) {
//       throw new Error("Invalid JSON format in payload");
//     }

//     if (
//       !parsedPayload.user ||
//       !parsedPayload.price ||
//       !parsedPayload.transactionId ||
//       !parsedPayload.title ||
//       !parsedPayload.expiry
//     ) {
//       throw new Error("Missing required payment data fields.");
//     }

//     const paymentDataPayload = parsedPayload as TPaymentData;

//     const paymentData = {
//       user: paymentDataPayload.user,
//       amount: Number(paymentDataPayload.price),
//       status: res && res.pay_status === "Successful" ? "Active" : "Expired",
//       transactionId: paymentDataPayload.transactionId,
//       planTitle: paymentDataPayload.title,
//       planPrice: Number(paymentDataPayload.price),
//       expiryDate: calculateExpiryDate(paymentDataPayload.expiry),
//     };

//     if (isNaN(paymentData.amount) || isNaN(paymentData.planPrice)) {
//       throw new Error("amount and plan price cannot be Nan");
//     }

//     if (res && res.pay_status === "Successful") {
//       await User.findByIdAndUpdate(
//         { _id: paymentData.user },
//         { isVerified: true },
//       );

//       await Payment.create(paymentData);
//       message = "Payment successful";
//       const filePath = join(__dirname, "../../../../views/confirmation.html");
//       let template = readFileSync(filePath, "utf-8");
//       template = template.replace("{{message}}", message);
//       return template;
//     } else {
//       throw new Error("Payment validation failed.");
//     }
//   } catch (error: any) {
//     message = "Payment failed";

//     const filePath = join(__dirname, "../../../../views/failConfirmation.html");
//     let template;
//     try {
//       template = readFileSync(filePath, "utf-8");
//     } catch (fileError) {
//       throw new AppError(
//         httpStatus.INTERNAL_SERVER_ERROR,
//         "Failed to load failConfirmation template",
//       );
//     }
//     template = template.replace("{{message}}", message);
//     return template;
//   }
// };

// const getAllPaymentsFromDB = async () => {
//   const payments = await Payment.find().populate("user");
//   return payments;
// };

// export const PaymentServices = {
//   createPaymentIntoDB,
//   confirmationService,
//   getAllPaymentsFromDB,
// };

/* eslint-disable @typescript-eslint/no-unused-vars */
// import { User } from "../auth/auth.model";
import { readFileSync } from "fs";
import { User } from "../user/user.model";
import { TPayment } from "./payment.interface";
import Payment from "./payment.model";
import { initiatePayment, verifypayment } from "./payment.utils";
import { join } from "path";

// Get all payments
const getAllPaymentsFromDB = async () => {
  const result = await Payment.find();
  return result;
};

// Make payment
const createPaymentIntoDB = async (payload: TPayment) => {
  const transactionId = `TNX-${Date.now()}-${payload.email}`;

  // Create a new payment record
  const payment = new Payment({
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    userId: payload.userId,
    amount: payload.amount,
    address: payload.address,
    transactionId,
  });
  await payment.save();

  // Update the isVerified field to true for the user
  await User.findByIdAndUpdate(payload.userId, { isVerified: true });

  // Initiate the payment process
  const paymentData = {
    transactionId,
    amount: payload.amount,
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    userId: payload.userId,
    address: payload.address,
  };

  const paymentSession = await initiatePayment(paymentData);
  return paymentSession;
};

// Payment confirmation message
const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifypayment(transactionId);
  console.log(verifyResponse);

  let result;
  let message = "";
  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    result = await User.findOneAndUpdate(
      { transactionId },
      {
        isVerified: true,
      }
    );
    message = "Successfully Paid!";
  } else {
    message = "Payment Failed!";
  }

  // return `<h1>Payment ${status}</h1>`;

  const filePath = join(__dirname, "../../../../views/confirmation.html");
  let template = readFileSync(filePath, "utf-8");
  // template = template.replace("{{message}}", status);
  // return template;

  template = template.replace(
    "{{messageText}}",
    message === "Successfully Paid!" ? "Payment Successful" : "Payment Failed"
  );
  template = template.replace(
    "{{icon}}",
    message === "Successfully Paid!" ? "✔️" : "❌"
  );
  template = template.replace(
    "{{iconClass}}",
    message === "Successfully Paid!" ? "success-icon" : "failed-icon"
  );

  return template;
};

export const PaymentServices = {
  createPaymentIntoDB,
  confirmationService,
  getAllPaymentsFromDB,
};

// 3rd ------------

// import httpStatus from "http-status";
// import AppError from "../../errors/AppError";
// import { User } from "../user/user.model";
// import { TPaymentInfo } from "./payment.interface";
// import crypto from "crypto";
// import { initiatePayment, verifyPayment } from "./payment.utils";
// import { PaymentInfo } from "./payment.model";

// const createPaymentIntoDB = async (
//   payload: Omit<TPaymentInfo, "transactionId">,
//   userId: string
// ) => {
//   // Validate if user exists
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   // const post = await Post.find({ author: user._id });

//   // Generate a random transaction ID
//   const transactionId = crypto.randomBytes(16).toString("hex");

//   const paymentData = { ...payload, transactionId };

//   const paymentResponse = await initiatePayment(paymentData);

//   if (!paymentResponse) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Payment initiation failed");
//   }

//   // Save the payment to the database
//   // Save the payment record to the database, associating it with the user
//   const result = await PaymentInfo.create({ ...paymentData, user: userId });
//   return {
//     paymentResponse,
//     result,
//   };
// };

// const confirmationService = async (
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

//       const updatedPayment = await PaymentInfo.findOneAndUpdate(
//         { transactionId },
//         { status: "Paid" },
//         { new: true }
//       );

//       if (!updatedPayment) {
//         throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
//       }

//       paymentStatus = "success";
//       message =
//         "Thank you <br /> Your premium access.Your transaction <br /> has been completed successfully!";
//     }
//   }

//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Payment ${
//         paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)
//       }</title>
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
//               background-color: ${
//                 paymentStatus === "success" ? "#FF69B4" : "#F25081"
//               };
//               color: #ffffff;
//               padding: 15px 30px;
//               text-decoration: none;
//               border-radius: 30px;
//               font-size: 1rem;
//               transition: background-color 0.3s ease;
//           }
//           .button:hover {
//               background-color: ${
//                 paymentStatus === "success" ? "#FF85B2" : "#FF4588"
//               };
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="success-icon"><img src="${
//             paymentStatus === "success"
//               ? "https://img.icons8.com/?size=100&id=123575&format=png&color=F25081"
//               : "https://img.icons8.com/?size=100&id=35879&format=png&color=F25081"
//           }" /></div>
//           <h1>${message}</h1>
//           <a href="http://localhost:3000" class="button">Go Back</a>
//       </div>
//   </body>
//   </html>
//   `;
// };

// const getAllPaymentsFromDB = async () => {
//   const payments = await PaymentInfo.find().populate("user");
//   return payments;
// };

// export const PaymentServices = {
//   createPaymentIntoDB,
//   confirmationService,
//   getAllPaymentsFromDB,
// };
