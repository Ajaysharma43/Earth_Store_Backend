const express = require('express');
const Router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Router.post('/Buy', async (req, res) => {
    try {
        const { token, amount } = req.body;
        console.log("the ammount is " + amount);
        
        if (!token || !token.email) {
            return res.status(400).json({ error: 'Token or email missing' });
        }

        const customer = await Stripe.customers.create({
            email: token.email,
            name : token.card.name, 
            source: token.id,  
        });

        const PaymentIntent = await Stripe.paymentIntents.create({
            amount : amount,
            currency : "usd",
            payment_method_types : ['card']
        })

        const invoiceItem = await Stripe.invoiceItems.create({
            customer: customer.id,
            amount: amount,  
            currency: 'usd',
            description: 'One time setup fee',
        });

        const invoice = await Stripe.invoices.create({
            customer: customer.id,
            collection_method: 'send_invoice',
            due_date: Math.floor(new Date().getTime() / 1000) + (30 * 24 * 60 * 60),  // Due in 30 days
        });

        await Stripe.invoices.finalizeInvoice(invoice.id);

        return res.status(200).json({ success: true, invoice });

    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ error: 'Payment processing failed' });
    }
});

Router.post('/GetInvoice' , async(req,res) => {
    const {id} = req.body;
    const Invoice = await Stripe.invoices.retrieve(id);
    res.json({Invoice : Invoice.status})
})

module.exports = Router;
