import { auth } from '@/auth';
import connectDb from '@/lib/db';
import DeliveryAssignment from '@/model/deliveryAssignment.model';

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDb();
        const session = await auth();
        const deliveryBoyId = session?.user?.id;
        const activeAssignment = await DeliveryAssignment.findOne({
            assignTo: deliveryBoyId,
            status: 'assigned',
        })
            .populate({
                path: 'order',
                populate: { path: 'address' },
            })
            .lean();

        if (!activeAssignment) {
            return NextResponse.json(
                {
                    active: false,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                active: true,
                assignment: activeAssignment,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(`error in  current order ${error}`);
        return NextResponse.json(
            {
                message: `error in current order : ${error}`,
            },
            { status: 500 }
        );
    }
}
