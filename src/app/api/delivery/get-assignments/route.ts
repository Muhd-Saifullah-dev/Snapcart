import { auth } from '@/auth';
import connectDb from '@/lib/db';
import DeliveryAssignment from '@/model/deliveryAssignment.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        const assignment = await DeliveryAssignment.find({
            broadcastedTo: session?.user?.id,
            status: 'broadcasted',
        }).populate('order');
        return NextResponse.json(assignment, { status: 200 });
    } catch (error) {
        console.log(`error in get assignment ${error}`);
        return NextResponse.json(
            { message: `get assignment error : ${error} ` },
            { status: 200 }
        );
    }
}
