import { Router } from "express";
import * as stripeController from "../controllers/stripe.controller";
import { authJwt } from "../middlewares";
const router = Router()

router.post('/checkout', stripeController.paymentIntent)

router.post('/webhook', authJwt.verifyToken, stripeController.stripeWebhook)

export default router