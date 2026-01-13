import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import Order from '@/model/order.model';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        console.log(process.env.NEXT_BASE_URL);
        await connectDb();
        const { userId, items, paymentMethod, address, totalAmount } =
            await req.json();
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: 'please send all credientials' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: 'user not found' },
                { status: 400 }
            );
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address,
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'snapCart Order Payment',
                        },
                        unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId: newOrder._id.toString(),
            },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        console.log('error in bacckend payment ', error);
        return NextResponse.json(
            { message: `order payment error ${error}` },
            { status: 500 }
        );
    }
}
