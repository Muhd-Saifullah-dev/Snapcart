import connectDb from '@/lib/db';
import User from '@/model/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
    try {
        await connectDb();
        const { userId, location } = await req.json();
        if (!userId || !location) {
            return NextResponse.json(
                { message: 'missing userId and location' },
                { status: 400 }
            );
        }
        const user = await User.findByIdAndUpdate(userId, { location });
        if (!user) {
            return NextResponse.json(
                { message: 'user not found' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: 'location updated' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `update location error ${error}` },
            { status: 500 }
        );
    }
}
