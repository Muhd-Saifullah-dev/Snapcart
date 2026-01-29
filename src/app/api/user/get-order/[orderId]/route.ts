import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await connectDb();
        const { orderId } = await params;

        console.log('orderiD', orderId);
        const order = await Order.findById(orderId).populate(
            'assignedDeliveryBoy'
        );
        if (!order) {
            return NextResponse.json(
                { message: 'order not found' },
                { status: 400 }
            );
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `get order by id error ${error}` },
            { status: 500 }
        );
    }
}
