import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync";
import { getUserInfoFromToken } from "../utils/getUserInfoFromToken";
// import { BookingServices, bookingServices } from "./booking.service";
import sendResponse from "../utils/sendResponse";
import { BookingServices } from "./booking.service";


// ============================================================
// Booking Controllers
// ============================================================

/**
 * Creates a new booking for a service.
 *
 * This controller extracts booking details from the request body,
 * modifies the object to match the booking schema, and passes the
 * user and booking details to the `BookingServices.createBookingIntoDB` service.
 * The response includes the populated booking details.
 *
 * Key functionalities:
 * - Extract booking details from request body
 * - Modify the object to match the booking schema
 * - Call service to create booking and populate customer, service, and slot details
 * - Return a success message with the booking data
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */


const createBooking = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const bookingData = req.body

  const { email } = getUserInfoFromToken(token as string)

  const result = await BookingServices.createBookingIntoDB(email, bookingData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking successful',
    data: result,
  })
})



// const getAllBookings = catchAsync(async (req, res) => {
//   const bookings = await BookingServices.getAllBookingsFromDB();
//   res.status(200).json({
//     status: httpStatus.OK,
//     message: "All bookings retrieved successfully",
//     success: true,
//     data: bookings,
//   });
// });




// const getBookingsByEmail = catchAsync(async (req, res) => {
//   const email = req.params.email; // Assuming email is passed as a URL parameter
//   const bookings = await BookingServices.getBookingsByUserEmail(email);

//   res.status(200).json({
//     status: httpStatus.OK,
//     message: "Bookings retrieved successfully",
//     success: true,
//     data: bookings,
//   });
// });

export const BookingControllers = {
  createBooking,
  // getAllBookings,
  // getBookingsByEmail,
};