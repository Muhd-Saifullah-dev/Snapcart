import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import { NextRequest, NextResponse } from 'next/server';
import { genrate_random_numeric_code } from '@/lib/otp';
import { sendMail } from '@/lib/mailer';
import { otpEmailTemplate } from '@/lib/otpEmailTemplate';

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { orderId } = await req.json();
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            return NextResponse.json(
                {
                    message: 'order not found',
                },
                { status: 400 }
            );
        }
        const otp = genrate_random_numeric_code({ length: 6 });
        order.deliveryOtp = otp;
        await order.save();
        const html = otpEmailTemplate({ title: 'Your Delivery Otp', otp });
        await sendMail(order.user.email, 'Your delivery Otp', html);

        return NextResponse.json(
            {
                message: 'otp send successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: `send otp error ${error}`,
            },
            {
                status: 500,
            }
        );
    }
}
