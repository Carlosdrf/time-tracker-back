import { Router } from "express";
import * as stripeController from "../controllers/stripe.controller";
const router = Router()


router.post('/checkout', stripeController.paymentIntent)

export default router