import stripeModel from "../models/Payments";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import db from '../../models';
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        console.log(event.type)
        console.log(req.body)

    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        console.log(err.message)
        return;
    }
    switch (event.type) {
        case 'charge.captured':
            const chargeCaptured = event.data.object;
            // Then define and call a function to handle the event charge.captured
            break;
        case 'charge.expired':
            const chargeExpired = event.data.object;
            // Then define and call a function to handle the event charge.expired
            break;
        case 'charge.failed':
            const chargeFailed = event.data.object;
            // Then define and call a function to handle the event charge.failed
            break;
        case 'charge.pending':
            const chargePending = event.data.object;
            // Then define and call a function to handle the event charge.pending
            break;
        case 'charge.refunded':
            const chargeRefunded = event.data.object;
            // Then define and call a function to handle the event charge.refunded
            break;
        case 'charge.succeeded':
            const chargeSucceeded = event.data.object;
            console.log(chargeSucceeded)
            // Then define and call a function to handle the event charge.succeeded
            break;
        case 'charge.updated':
            const chargeUpdated = event.data.object;
            // Then define and call a function to handle the event charge.updated
            break;
        case 'charge.dispute.closed':
            const chargeDisputeClosed = event.data.object;
            // Then define and call a function to handle the event charge.dispute.closed
            break;
        case 'charge.dispute.created':
            const chargeDisputeCreated = event.data.object;
            // Then define and call a function to handle the event charge.dispute.created
            break;
        case 'charge.dispute.funds_reinstated':
            const chargeDisputeFundsReinstated = event.data.object;
            // Then define and call a function to handle the event charge.dispute.funds_reinstated
            break;
        case 'charge.dispute.funds_withdrawn':
            const chargeDisputeFundsWithdrawn = event.data.object;
            // Then define and call a function to handle the event charge.dispute.funds_withdrawn
            break;
        case 'charge.dispute.updated':
            const chargeDisputeUpdated = event.data.object;
            // Then define and call a function to handle the event charge.dispute.updated
            break;
        case 'charge.refund.updated':
            const chargeRefundUpdated = event.data.object;
            // Then define and call a function to handle the event charge.refund.updated
            break;
        case 'payment_intent.amount_capturable_updated':
            const paymentIntentAmountCapturableUpdated = event.data.object;
            // Then define and call a function to handle the event payment_intent.amount_capturable_updated
            break;
        case 'payment_intent.canceled':
            const paymentIntentCanceled = event.data.object;
            // Then define and call a function to handle the event payment_intent.canceled
            break;
        case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;
            // Then define and call a function to handle the event payment_intent.created
            break;
        case 'payment_intent.partially_funded':
            const paymentIntentPartiallyFunded = event.data.object;
            // Then define and call a function to handle the event payment_intent.partially_funded
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            // Then define and call a function to handle the event payment_intent.payment_failed
            break;
        case 'payment_intent.processing':
            const paymentIntentProcessing = event.data.object;
            // Then define and call a function to handle the event payment_intent.processing
            break;
        case 'payment_intent.requires_action':
            const paymentIntentRequiresAction = event.data.object;
            // Then define and call a function to handle the event payment_intent.requires_action
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
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
                user_id: req.body.user_id
            }
        })
        res.json({ clientSecret: paymentI.client_secret })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'failed transaction' })
    }

}
export const getPayments = async (req, res) => {
    const { user_id } = req.body
    console.log(user_id)
    const payments = await db.payments.findAll({
        include: [
            { model: db.status },
            { model: db.currencies }
        ],
        where: { user_id: req.userId }
    })
    res.json(payments)
}