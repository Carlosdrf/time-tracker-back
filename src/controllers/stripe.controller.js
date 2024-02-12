import { Stripe } from "stripe";
import stripeModel from "../models/Payments";
import { getExcelRowCol } from "excel4node";
const stripe = require('stripe')(process.env.STRIPE_WEBHOOK_SECRET)
// const stripe = Stripe(process.env.STRIPE_WEBHOOK_SECRET);
import db from '../../models';

export const stripeWebhook = async (req, res) => {
    console.log(req.body)
    const sig = req.headers['stripe-signature'];
    console.log(sig)
    console.log('---------------SUCCESSS-------------')
    let event;
    let endpointSecret = 'whsec_c0612065abb1bca53509f8d38f8a81c4ab8da2a18d654e838b799485ae6c59b5'
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(event.type)

    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // switch (event.type) {
    //     case 'checkout.session.async_payment_failed':
    //       const checkoutSessionAsyncPaymentFailed = event.data.object;
    //       // Then define and call a function to handle the event checkout.session.async_payment_failed
    //       break;
    //     case 'checkout.session.async_payment_succeeded':
    //       const checkoutSessionAsyncPaymentSucceeded = event.data.object;
    //       // Then define and call a function to handle the event checkout.session.async_payment_succeeded
    //       break;
    //     case 'checkout.session.completed':
    //       const checkoutSessionCompleted = event.data.object;
    //       // Then define and call a function to handle the event checkout.session.completed
    //       break;
    //     case 'checkout.session.expired':
    //       const checkoutSessionExpired = event.data.object;
    //       // Then define and call a function to handle the event checkout.session.expired
    //       break;
    //     // ... handle other event types
    //     default:
    //       console.log(`Unhandled event type ${event.type}`);
    //   }
    // const items = {
    //     id: req.body.id,
    //     description: req.body.description,
    //     updated_at: new Date(Date.now()),
    //     amount: req.body.amount,
    //     user_id: req.userId,
    //     status_id: 1
    // }
    // console.log(items)
    // await stripeModel.updatePayment(items)
    // res.json({ message: 'payment succeded' })
    res.json({ received: true })
}

export const paymentIntent = async (req, res) => {
    const items = req.body
    // console.log(req)
    // const user = await db.Users.findAll({
    //     include: 'companies',
    //     where:{ id: req.userId },
    // });
    // console.log(user[0].dataValues)
    try {
        const cantInEur = Math.round(items.amount * 100)
        console.log(cantInEur)
        const paymentI = await stripe.paymentIntents.create({
            amount: cantInEur,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                user_: req.body.user_id
            }
        })
        res.json({ clientSecret: paymentI.client_secret })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'failed transaction' })
    }

}
export const getPayments = async (req, res) => {
    const payments = await db.payments.findAll({ include: [{ model: db.status }, { model: db.currencies }] })
    // const payments =  await stripeModel.getPayments(req.userId)
    res.json(payments)
}