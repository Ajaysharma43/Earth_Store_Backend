const express = require('express');
const Users = require('../Schemma/UserSchemmma');
const Router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Router.post('/Buy', async (req, res) => {
    try {
        const { token, amount, UserID } = req.body;
        console.log("the ammount is " + amount);

        const User = await Users.findOne({ _id: UserID })
        if (User.StripeID) {
            const FindCustomer = await Stripe.customers.retrieve(User.StripeID)
            if (FindCustomer) {
                const Charges = await Stripe.charges.create({
                    amount: amount,
                    currency: 'usd',
                    customer: FindCustomer.id,
                    receipt_email: token.email
                })

                const PaymentIntent = await Stripe.paymentIntents.create({
                    amount: amount,
                    currency: "usd",
                    payment_method_types: ['card']
                })

                const invoiceItem = await Stripe.invoiceItems.create({
                    customer: FindCustomer.id,
                    amount: amount,
                    currency: 'usd',
                    description: 'One time setup fee',
                });

                const invoice = await Stripe.invoices.create({
                    customer: FindCustomer.id,
                    collection_method: 'send_invoice',
                    due_date: Math.floor(new Date().getTime() / 1000) + (30 * 24 * 60 * 60),  // Due in 30 days
                });

                await Stripe.invoices.finalizeInvoice(invoice.id);

                return res.status(200).json({ success: true, invoice });
            }
            else {
                console.log("customer not existed");
            }
        }
        else {
            if (!token || !token.email) {
                return res.status(400).json({ error: 'Token or email missing' });
            }
            const customer = await Stripe.customers.create({
                address: {
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip,
                },
                email: token.email,
                name: token.card.name,
                source: token.id,
                phone: User.PhoneNumber
            });

            const Charges = await Stripe.charges.create({
                amount: amount,
                currency: 'usd',
                customer: customer.id,
                receipt_email: token.email
            })

            const PaymentIntent = await Stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
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

            const UpDateUser = await Users.findOne({ _id: UserID })
            UpDateUser.StripeID = invoice.customer
            await UpDateUser.save();

            return res.status(200).json({ success: true, invoice });
        }

    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ error: 'Payment processing failed' });
    }
});

Router.post('/GetInvoice', async (req, res) => {
    const { id } = req.body;
    const Invoice = await Stripe.invoices.retrieve(id);
    res.json({ Invoice: Invoice.customer })
})

Router.get('/Customers', async (req, res) => {
    const Customers = await Stripe.customers.list({
        limit: 3
    })
    res.json({ customer: Customers })
})

Router.delete('/CheckoutCart', async (req, res) => {
    try {
        const { Product, UserID } = req.query;

        const user = await Users.findOne({ _id: UserID })
        const CartProducts = user.CartProducts
        user.Checkout.push(...user.CartProducts);
        
        user.CartProducts = [];
        await user.save()
        res.json({Message : user})
    }
    catch (error) {
        console.error("the error is  " + error);

    }
})

module.exports = Router;
