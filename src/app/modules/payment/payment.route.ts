import express from "express";
import { PaymentController } from "./payment.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middleware/auth";
const router = express.Router();

router.post("/create", PaymentController.createPayment);

 router.post("/confirmation", PaymentController.confirmationController);
//router.get("/confirmation", PaymentController.confirmationController);


router.get("/get-all", auth(USER_ROLE.ADMIN), PaymentController.getAllPayments);

export const PaymentRoute = router;
