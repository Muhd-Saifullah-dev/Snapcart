import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error(`signature verification failed ${error}`);
        return NextResponse.json(
            { message: 'Webhook Error: Invalid signature' },
            { status: 400 }
        );
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await connectDb();
        const orderId = session?.metadata?.orderId;
        if (!orderId) {
            return NextResponse.json(
                { message: 'order id is not valid' },
                { status: 404 }
            );
        }
        console.log('order id is ', orderId);
        const objectId = new mongoose.Types.ObjectId(orderId);
        await Order.findByIdAndUpdate(objectId, {
            isPaid: true,
        });
    }
    return NextResponse.json({ recieved: true }, { status: 200 });
}
