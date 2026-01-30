import connectDb from '@/lib/db';

import Message from '@/model/message.model';
import Order from '@/model/order.model';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const { roomId } = await req.json();
        const room = await Order.findById(roomId);
        if (!room) {
            return NextResponse.json(
                { message: 'room not found' },
                { status: 400 }
            );
        }

        const message = await Message.find({ roomId: room._id });

        return NextResponse.json(message, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `get  messages error  : ${error}` },
            { status: 500 }
        );
    }
}
