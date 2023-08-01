import { Stripe } from "stripe";
import stripeModel from "../models/Payments";
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')

export const checkout = async (req, res) => {
    const stripeToken = req.body.stripeToken;
    const {items} = req.body
    const cantidad = req.body.cantidad
    const cantInEur = Math.round(cantidad * 10)
    const chargeObject = await stripe.charges.create({
        amount: cantInUsd,
        currency: 'usd',
        // source: stripeToken,
        capture: true,
        description: 'xdxd',
        receipt_email: 'crivas@i-nimble.com'
    })
    try {
        await stripe.charges.capture(chargeObject.id)
        res.json(chargeObject)
    } catch (error) {
        await stripe.refunds.create({ charge: chargeObject.id })
        res.json(chargeObject)
    }
}

export const paymentIntent = async (req, res) => {
    const items = req.body

    console.log(req.body)
    console.log(items)
    const cantInEur = Math.round(items.cantidad * 10)
    const paymentI = await stripe.paymentIntents.create({
        amount: cantInEur,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true
        }
    })
    res.json({ clientSecret: paymentI.client_secret })
}

export const stripeWebhook = async(req, res)=>{
    console.log(req.body)
    console.log(req.userId)
    const items = {
        description: req.body.description,
        date: new Date(Date.now()),
        amount: req.body.amount,
        user_id: req.userId,
        status: 1
    }
    console.log(items)
    await stripeModel.createPayment(items)
    res.json()
}