import { Stripe } from "stripe";
import stripeModel from "../models/Payments";
import { getExcelRowCol } from "excel4node";
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')
import db  from '../../models'
import { where } from "sequelize";

export const paymentIntent = async (req, res) => {
    const items = req.body
    // const user = await db.Users.findAll({
    //     include: 'companies',
    //     where:{ id: req.userId },
    // });
    // console.log(user[0].dataValues)
    const cantInEur = Math.round(items.amount * 100)
    console.log(cantInEur)
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
    const items = {
        id: req.body.id,
        description: req.body.description,
        updated_at: new Date(Date.now()),
        amount: req.body.amount,
        user_id: req.userId,
        status_id: 1
    }
    console.log(items)
    await stripeModel.updatePayment(items)
    res.json({message:'payment succeded'})
}

export const getPayments = async (req, res) => {
    const payments = await db.payments.findAll({include: [{model: db.status}, {model: db.currencies}]})
    // const payments =  await stripeModel.getPayments(req.userId)
    res.json(payments)
}