/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Booking } from "../booking/bookings.model";
// import { verifyPament } from "./payment.utils";

import { join } from "path";
import { readFileSync } from "fs";
import { verifyPament } from "./payment.utils";
import { Booking } from "../booking/booking.model";
import { User } from "../user/user.model";

const confirmationService = async (
  tran_id: string,
  status: string,
  paidStatus: string
) => {
  const verifyResponse = await verifyPament(tran_id);
  console.log(verifyResponse);
  let result;
  let message = "";

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    // Fetch booking info using the transaction ID
    const bookingInfo = await Booking.findOne({ tran_id });
    if (bookingInfo) {
      const userId = bookingInfo?.user; // Assuming bookingInfo contains user ID

      // Update the user's status to 'premium'
      await User.findByIdAndUpdate(
        userId,
        { status: "premium" },
        { new: true }
      );

      // Update booking status
      result = await Booking.findOneAndUpdate(
        { tran_id },
        {
          status: paidStatus,
        },
        { new: true }
      );
    } else {
      message = "Payment Failed!";
    }

    // Load the confirmation HTML template

    const filePath = join(__dirname, "../../../views/confirmation.html");
    let template = readFileSync(filePath, "utf-8");

    // Replace template placeholders with the payment result
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
  }
};

export const PaymentServices = {
  confirmationService,
};

/*
import config from "../../config";
import { Booking } from "../booking/booking.model";
import { User } from "../user/user.model";
import { verifyPayment } from "./payment.utils";

const confirmationService = async (
  transactionId: string,
  status: string,
  paidStatus: string
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse && verifyResponse?.pay_status === "Successful") {
    const bookingInfo = await Booking.find({ tran_id: transactionId });
    const userId = bookingInfo[0]?.user;
    await User.findByIdAndUpdate(userId, { status: "premium" }, { new: true });

    await Booking.findOneAndUpdate(
      { tran_id: transactionId },
      {
        status: paidStatus,
      },
      { new: true }
    );
  }

  const successTemplate = `
    <html>

     <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f5f5f5;
      }
      .container {
        text-align: center;
        background-color: #ffffff;
        padding: 50px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .icon {
        font-size: 50px;
        margin-bottom: 20px;
      }
      .success-icon {
        color: #28a745;
      }
      .failed-icon {
        color: #dc3545;
      }
      .message {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .description {
        font-size: 16px;
        color: #666;
      }
      .btn {
        padding: 10px 20px;
        background-color: #14a0d1;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
      }
      .btn:hover {
        background-color: #117c9f;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .btn:active {
        background-color: #0e6781;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="icon {{iconClass}}">{{icon}}</div>
      <div class="message">{{messageText}}</div>
      <p class="description">
        Thank you for your transaction. You will receive a confirmation email
        shortly.
      </p>
      <a href="${config.client_live_url_service_page}"" class="btn"
        >Back To Home</a
      >
    </div>
  </body>
      
    </html>
  `;

  return successTemplate;
};

export const PaymentServices = {
  confirmationService,
};

*/
