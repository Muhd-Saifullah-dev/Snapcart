import Grocery from '@/model/grocery.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const groceries = await Grocery.find({});
        return NextResponse.json(groceries, { status: 200 });
    } catch (error) {
        console.log(`error in get groceries api :${error}`);
        return NextResponse.json(
            { message: `get groceries error ${error}` },
            { status: 200 }
        );
    }
}
