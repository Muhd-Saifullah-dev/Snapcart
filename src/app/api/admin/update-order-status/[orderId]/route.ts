import connectDb from '@/lib/db';
import DeliveryAssignment from '@/model/deliveryAssignment.model';
import Order from '@/model/order.model';
import User from '@/model/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await connectDb();
        const { orderId } = await params;
        const { status } = await req.json();
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            return NextResponse.json(
                { message: 'order not found' },
                { status: 400 }
            );
        }
        order.status = status;
        let DeliveryBoysPayload: any = [];
        if (status === 'out of delivery' && !order.assignment) {
            const { latitude, longitude } = order.address;
            const nearByDeliveryBoys = await User.find({
                role: 'deliveryBoy',
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [Number(longitude), Number(latitude)],
                        },
                        $maxDistance: 10000,
                    },
                },
            });
            const nearByIds = nearByDeliveryBoys.map((b) => b._id);
            const busyIds = await DeliveryAssignment.find({
                assignTo: { $in: nearByIds },
                status: { $nin: ['broadcasted', 'completed'] },
            }).distinct('assignTo');
            const busyIdsSet = new Set(busyIds.map((b) => String(b)));
            const availableDeliveryBoys = nearByDeliveryBoys.filter(
                (b) => !busyIdsSet.has(String(b._id))
            );

            const candidates = availableDeliveryBoys.map((b) => b._id);
            if (candidates.length === 0) {
                await order.save();
                return NextResponse.json(
                    { message: 'there is no available Delivery boys' },
                    { status: 400 }
                );
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                broadcastedTo: candidates,
                status: 'broadcasted',
            });
            order.assignment = deliveryAssignment._id;

            DeliveryBoysPayload = availableDeliveryBoys.map((b) => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0],
            }));
            await deliveryAssignment.populate('order');
        }
        await order.save();
        await order.populate('user');
        return NextResponse.json(
            {
                assignment: order.assignment?._id,
                availableBoys: DeliveryBoysPayload,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: `error in update order status ${error}` },
            { status: 500 }
        );
    }
}
