/* eslint-disable no-undef */
// import {  ObjectId } from "mongoose";


// // Vehicle Interface
// export interface TBooking {
//   //   customer: ObjectId;
//   _id: ObjectId;
//   serviceId: ObjectId;
//   slotId: ObjectId;
//   customer: {
  //     name: string;
  //     email: string;
  //     phone: number;
//     address: string;
//   };
//   service: object;
//   slot: object;
//   vehicleType: string;
//   vehicleBrand: string;
//   vehicleModel: string;
//   manufacturingYear: number;
//   registrationPlate: string;
//   tran_id: string;
//   paymentStatus: string;
// }

// // Slot Document Interface
// export interface SlotDocument extends TBooking, Document {}


import { Types } from "mongoose"

export interface TBooking {
  
  user: Types.ObjectId
  tran_id: string
  status: string
}



export interface TBookingRequest {
  amount: string
  status: string
  tran_id: string
}