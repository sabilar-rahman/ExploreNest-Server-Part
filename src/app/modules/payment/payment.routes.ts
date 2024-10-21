// import { Router } from 'express'
// import { PaymentController } from './payment.controller'

// const router = Router()

// router.post('/verifyProfile', PaymentController.makePayment)

// router.post('/confirmation', PaymentController.paymentConfirmation)

// router.get('/paymentStats', PaymentController.getPaymentStats)

// router.get('/dashboard-data', PaymentController.dashboardData)

// export const PaymentRoute = router

import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.utils";


const router = express.Router();

router.post("/create", PaymentController.createPayment);

router.post("/confirmation", PaymentController.confirmationController);
router.get("/get-all", auth(USER_ROLE.admin), PaymentController.getAllPayments);

export const PaymentRoute = router;