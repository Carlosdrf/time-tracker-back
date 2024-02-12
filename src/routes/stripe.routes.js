import { Router } from "express";
import * as stripeController from "../controllers/stripe.controller";
import { authJwt } from "../middlewares";
const router = Router()

router.get('/', authJwt.verifyToken, stripeController.getPayments)

router.post('/checkout', authJwt.verifyToken, stripeController.paymentIntent)

router.post('/webhook', stripeController.stripeWebhook)

export default router