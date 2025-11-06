import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-04-10',
  });

export default async (req:NextApiRequest, res:NextApiResponse) => {
    console.log(req.body)
    const {user, tripId, passengers, is_paid,payment_method,successUrl, cancelUrl} = req.body;
    try {
        console.log('try')
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'test name',
                        },
                        unit_amount: 100 * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                trip_id: "4",
                passengers: '2'
            },
            success_url: `${successUrl}`,
            cancel_url: cancelUrl,
        });
        console.log('sessionId',session.id)
        res.status(200).json({id: session.id})
    
    } catch (err: any) {
        console.log('error:',err.message)
        res.status(500).json({message: err.message})
    };
}
