import { auth } from '@/auth';
import User from '@/model/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { message: 'user is not authenticated' },
                { status: 400 }
            );
        }
        const user = await User.findOne({ email: session.user.email }).select(
            '-password'
        );
        if (!user) {
            return NextResponse.json(
                { message: 'user not found' },
                { status: 400 }
            );
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.log(`error in get me api ${error}`);
        return NextResponse.json(
            { message: `get me error ${error}` },
            { status: 500 }
        );
    }
}
