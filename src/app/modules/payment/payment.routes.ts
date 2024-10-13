import { Router } from 'express'
import { PaymentController } from './payment.controller'

const router = Router()

router.post('/verifyProfile', PaymentController.makePayment)

router.post('/confirmation', PaymentController.paymentConfirmation)

router.get('/paymentStats', PaymentController.getPaymentStats)

router.get('/dashboard-data', PaymentController.dashboardData)

export const PaymentRoute = router