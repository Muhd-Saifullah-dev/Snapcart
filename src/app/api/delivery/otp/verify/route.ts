import connectDb from '@/lib/db';
import DeliveryAssignment from '@/model/deliveryAssignment.model';
import Order from '@/model/order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { orderId, otp } = await req.json();
        if (!orderId || !otp) {
            return NextResponse.json(
                {
                    message: 'orderId or Otp not found',
                },
                { status: 400 }
            );
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                {
                    message: 'order not found',
                },
                { status: 400 }
            );
        }

        if (order.deliveryOtp !== otp) {
            return NextResponse.json(
                {
                    message: 'Incorrect or expired Otp',
                },
                { status: 400 }
            );
        }

        order.status = 'delivered';
        order.deliveryOtpVerification = true;
        order.deliveryAt = new Date();
        await order.save();
        await await DeliveryAssignment.updateOne(
            { order: orderId },
            { $set: { assignTo: null, status: 'completed' } }
        );

        return NextResponse.json(
            { message: 'Delivery successfully completed' },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: `verify otp error :${error}`,
            },
            { status: 500 }
        );
    }
}
