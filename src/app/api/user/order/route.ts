import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import User from '@/model/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
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

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: `place order error ${error}` },
            { status: 500 }
        );
    }
}
