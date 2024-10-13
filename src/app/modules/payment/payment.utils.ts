/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import axios from "axios";
import config from "../../config";



dotenv.config();
export const initiatePayment = async (paymentData:any) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      tran_id: paymentData.tran_id,
      success_url: `${config.live_backend_url}/api/payment/confirmation?tran_id=${paymentData.tran_id}&status=success`,
      fail_url: `${config.live_backend_url}/api/payment/confirmation?status=failed`,
      cancel_url: `${config.client_live_url}`,
      amount: paymentData.amount,
      currency: "BDT",
      desc: "Service Booking Payment",
      cus_name: paymentData.customer.name,
      cus_email: paymentData.customer.email,
      cus_add1: paymentData.customer.address,
      cus_city: paymentData.customer.city || "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: paymentData.customer.phone,
      type: "json",
    });
    const paymentUrl = response.data?.payment_url;

    if (!paymentUrl) {
      throw new Error("Payment URL not found in response");
    }
    console.log(response.data);
    return { status: response.status, paymentUrl };
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw new Error("Payment initiation failed");
  }
};

export const verifyPament = async (tnxId: string) => {
  const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
    params: {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      type: "json",
      request_id: tnxId,
    },
  });

  return response.data;
};