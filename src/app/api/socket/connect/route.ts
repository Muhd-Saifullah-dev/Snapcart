import connectDb from '@/lib/db';
import User from '@/model/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
    try {
        await connectDb();
        const { userId, socketId } = await req.json();
        const user = await User.findByIdAndUpdate(
            userId,
            {
                socketId,
                isOnline: true,
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { message: 'user not found' },
                { status: 400 }
            );
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: `error in user update with socket id and is online  ${error}`,
            },
            { status: 500 }
        );
    }
}
