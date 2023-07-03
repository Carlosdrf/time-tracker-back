import { Stripe } from "stripe";
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')

export const checkout = async (req, res)=>{
    const stripeToken = req.body.stripeToken;
    const cantidad = req.body.cantidad
    const cantInEur = Math.round(cantidad *10)
    const chargeObject = await stripe.charges.create({
        amount: cantInEur,
        currency: 'eur',
        source: stripeToken,
        capture: false,
        description: 'xdxd',
        receipt_email: 'crivas@i-nimble.com'
    })
    try {
        await stripe.charges.capture(chargeObject.id)
        res.json(chargeObject)
    } catch (error) {
        await stripe.refunds.create({charge: chargeObject.id})
        res.json(chargeObject)
    }
}

export const paymentIntent = async(req,res) =>{
    const items = req.body

    console.log(req.body)
    console.log(items)
    const cantInEur = Math.round(items.cantidad * 10)
    const paymentI = await stripe.paymentIntents.create({
        amount: cantInEur,
        currency: 'usd',
        automatic_payment_methods:{
            enabled: true
        }
    })
    res.json({clientSecret : paymentI.client_secret})
}