const express = require('express');
const Users = require('../Schemma/UserSchemmma');
const Router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Router.post('/Buy', async (req, res) => {
    try {
        const { token, amount, UserID, Details } = req.body;
        console.log("the ammount is " + amount);

        const User = await Users.findOne({ _id: UserID })
        if (User.StripeID) {
            if (!token) {
                return res.status(400).json({ error: 'Token or email missing' });
            }

            const FindCustomer = await Stripe.customers.retrieve(User.StripeID)
            
            if (FindCustomer) {
                const Charges = await Stripe.charges.create({
                    amount: amount * 100,
                    currency: 'usd',
                    customer: FindCustomer.id,
                    receipt_email: Details.Email
                })

                const PaymentIntent = await Stripe.paymentIntents.create({
                    amount: amount * 100,
                    currency: "usd",
                    payment_method_types: ['card']
                })

                const invoiceItem = await Stripe.invoiceItems.create({
                    customer: FindCustomer.id,
                    amount: amount * 100,
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
                    city: Details.Street,
                    country: Details.Country,
                    postal_code: Details.Pincode,
                },
                email: Details.Email,
                name: Details.FullName,
                source: token.id,
                phone: Details.PhoneNumber
            });

            const Charges = await Stripe.charges.create({
                amount: amount * 100,
                currency: 'usd',
                customer: customer.id,
                receipt_email: Details.Email
            })

            const PaymentIntent = await Stripe.paymentIntents.create({
                amount: amount * 100,
                currency: "usd",
                payment_method_types: ['card']
            })

            const invoiceItem = await Stripe.invoiceItems.create({
                customer: customer.id,
                amount: amount * 100,
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

Router.delete("/CheckoutCart", async (req, res) => {
    try {
      const { Product, UserID } = req.query;
  
      // Find the user
      const user = await Users.findOne({ _id: UserID });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (user.CartProducts.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
  
      // Create a new array with updated payment method and timestamp
      const updatedProducts = user.CartProducts.map((item) => ({
        ProductID: item.ProductID,
        Name: item.Name,
        Type: item.Type,
        Price: item.Price,
        Image: item.Image,
        Description: item.Description,
        Quantity: item.Quantity,
        PaymentMethod: "Online Payment",
        PlacedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      }));
  
      // Push updated products to Checkout and OrderHistory
      user.Checkout.push(...updatedProducts);
      user.OrderHistory.push(...updatedProducts);
  
      // Clear Cart after successful checkout
      user.CartProducts = [];
  
      await user.save();
  
      res.status(200).json({
        message: "Checkout successful with Online Payment",
        checkout: user.Checkout,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

Router.post("/CheckoutCOD", async (req, res) => {
    try {
      const { Token, Total, UserID } = req.body;
  
      
      const user = await Users.findOne({ _id: UserID });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const updatedProducts = user.CartProducts.map((item) => ({
        ProductID: item.ProductID,
        Name: item.Name,
        Type: item.Type,
        Price: item.Price,
        Image: item.Image,
        Description: item.Description,
        Quantity: item.Quantity,
        PaymentMethod: "Cash on Delivery",
        PlacedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      }));
  
      
      user.Checkout.push(...updatedProducts);
      user.OrderHistory.push(...updatedProducts);
  
      
      user.CartProducts = [];
  
      await user.save();
  
      res.status(200).json({
        message: "Checkout successful with COD",
        checkout: user.Checkout,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  Router.get('/GetSingleProduct' , async(req,res) => {
    const {UserID , ProductID } = req.query;
    const user = await Users.findOne({_id : UserID})
    const CheckoutProduct = user.Checkout.find((Product) => Product.id === ProductID)
    res.json({CheckoutProduct : CheckoutProduct})
  })
module.exports = Router;
