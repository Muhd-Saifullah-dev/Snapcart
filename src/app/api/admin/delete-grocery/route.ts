import { auth } from '@/auth';
import connectDb from '@/lib/db';
import Grocery from '@/model/grocery.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (session?.user?.role !== 'admin') {
            return NextResponse.json(
                { message: `you are not admin` },
                { status: 400 }
            );
        }
        const { groceryId } = await req.json();
        const groceries = await Grocery.findByIdAndDelete(groceryId);
        return NextResponse.json(groceries, { status: 200 });
    } catch (error) {
        console.log(`error in delete grocery api ${error}`);
        return NextResponse.json(
            {
                message: `error in delete grocery ${error}`,
            },
            { status: 500 }
        );
    }
}
