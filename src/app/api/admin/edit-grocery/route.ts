import { auth } from '@/auth';
import uploadOnCloudhinary from '@/lib/cloudhinary';
import connectDb from '@/lib/db';
import Grocery from '@/model/grocery.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (session?.user?.role !== 'admin') {
            return NextResponse.json(
                { message: 'you are not admin' },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const groceryId = formData.get('groceryId') as string;
        const category = formData.get('category') as string;
        const unit = formData.get('unit') as string;
        const price = formData.get('price') as string;
        const file = formData.get('image') as Blob | null;
        let imageUrl;
        if (file) {
            imageUrl = await uploadOnCloudhinary(file);
        }
        const grocery = await Grocery.findByIdAndUpdate(
            groceryId,
            {
                name,
                category,
                price,
                unit,
                image: imageUrl,
            },
            { new: true }
        );
        return NextResponse.json(grocery, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `edit grocery error ${error}` },
            { status: 500 }
        );
    }
}
