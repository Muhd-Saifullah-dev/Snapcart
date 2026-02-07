import React from 'react';
import DeliveryBoyDashboard from './DeliveryBoyDashboard';
import { auth } from '@/auth';
import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import mongoose from 'mongoose';
async function DeliveryBoy() {
    await connectDb();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const orders = await Order.aggregate([
        {
            $match: {
                assignedDeliveryBoy: new mongoose.Types.ObjectId(deliveryBoyId),
                deliveryOtpVerification: true,
            },
        },
    ]);

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
        (o) => new Date(o.deliveryAt).toDateString() === today
    ).length;
    const todaysEarning = todayOrders * 40;
    return (
        <>
            <DeliveryBoyDashboard earning={todaysEarning} />
        </>
    );
}

export default DeliveryBoy;
