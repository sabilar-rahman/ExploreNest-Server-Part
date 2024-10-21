import axios from 'axios'

// const verifyPayment = async (transactionId: string) => {
//   const response = await axios.post(
//     `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php`,
//     {
//       params: {
//         store_id: 'aamarpaytest',
//         signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
//         type: 'json',
//         request_id: transactionId,
//       },
//     },
//   )
//   return response?.data
// }


// export default verifyPayment

// ++++++++++++++++++++++++++++++++++++++++++

/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
// // import { TPayment } from "./payment.interface";
// import config from "../../config";



// export const initialPayment = async (paymentData :any) => {
//   // const frontendUrl = `${config.NODE_ENV === "development" ? config.frontend_base_url : config.frontend_live_url}`;
//   // const backendUrl = `${config.NODE_ENV === "development" ? "http://localhost:5000" : config.backend_live_url}`;

//   const response = await axios.post(config.aamarpay_url!, {
//     store_id: config.store_id,
//     signature_key: config.signature_key,
//     tran_id: paymentData.transitionId,
//     success_url: `${config.backendUrl}/api/v1/payment/conformation/${paymentData.user}?transitionId=${paymentData.transitionId}&status=success`,
//     fail_url: `${config.backendUrl}/api/v1/payment/conformation/${paymentData.user}?transitionId=${paymentData.transitionId}&status=failed`,
//     cancel_url: `${config.frontendUrl}`,
//     amount: paymentData.amount,
//     currency: "BDT",
//     desc: "Payment for get a premium accessability for your profile",
//     cus_name: paymentData.customerName,
//     cus_email: paymentData.customerEmail,
//     cus_add1: paymentData.customerAddress,
//     cus_add2: "N/A",
//     cus_city: "N/A",
//     cus_state: "N/A",
//     cus_postcode: "N/A",
//     cus_country: paymentData.customerCountry,
//     cus_phone: "N/A",
//     type: "json",
//   });

//   return response.data;
// };

// // verify payment
// export const verifyPayment = async (transitionId: string) => {
//   const response = await axios.get(config.payment_verify_url!, {
//     params: {
//       request_id: transitionId,
//       store_id: config.store_id,
//       signature_key: config.signature_key,
//       type: "json",
//     },
//   });

//   return response.data;
// };


export const initiatePayment = async (payload: TPaymentData) => {
  const response = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: payload.transactionId,
    success_url: `${config.backend_url}/api/payment/confirmation?transactionId=${payload.transactionId}&status=success&payload=${encodeURIComponent(JSON.stringify(payload))}`,
    fail_url: `${config.backend_url}/api/payment/confirmation?transactionId=${payload.transactionId}&status=failed`,
    cancel_url: `${config.frontend_url}`,
    amount: payload.price,
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: payload?.paymentUser?.name,
    cus_email: payload?.paymentUser?.email,
    cus_add1: payload?.paymentUser?.address,
    cus_add2: payload?.paymentUser?.address,
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: payload?.paymentUser?.mobileNumber,
    type: "json",
  });

  return response.data;
};