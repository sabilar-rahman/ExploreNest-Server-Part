import { Router } from 'express'
import { PaymentController } from './payment.controller'

const router = Router()

router.post('/verifyProfile', PaymentController.makePayment)

router.post('/confirmation', PaymentController.paymentConfirmation)

router.get('/paymentStats', PaymentController.getPaymentStats)

router.get('/dashboard-data', PaymentController.dashboardData)

export const PaymentRoute = router


// import { Router } from "express";
// import { PaymentController } from "./payment.controller";
// import Auth from "../../middlewares/auth";
// import { USER_ROLE } from "../user/user.utils";

// const router = Router();

// router.post("/subscriptions/:userId", PaymentController.subscriptions);
// router.post("/conformation/:userId", PaymentController.paymentConformation);
// router.get("/", Auth(USER_ROLE.admin), PaymentController.getPaymentsData);
// router.get(
//   "/analytics",
//   Auth(USER_ROLE.admin),
//   PaymentController.getPaymentsData,
// );

// export const PaymentRoutes = router;