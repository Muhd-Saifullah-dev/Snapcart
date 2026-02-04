import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';
import connectDb from '@/lib/db';
import Order from '@/model/order.model';
import User from '@/model/user.model';

async function AdminDashboard() {
    await connectDb();
    const [totalOrder, TotalCustomer, pendingDeliveries, orders] =
        await Promise.all([
            Order.countDocuments(),
            User.countDocuments(),
            Order.countDocuments({ status: 'pending' }),
            Order.find({}),
        ]);

    const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
    );

    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const todayOrder = orders.filter(
        (o) => new Date(o.createdAt) >= startOfToday
    );
    const todayRevenue = todayOrder.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
    );

    const SevenDaysOrders = orders.filter(
        (o) => new Date(o.createdAt) >= sevenDaysAgo
    );
    const sevenDaysRevenue = SevenDaysOrders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
    );

    const stats = [
        { title: 'Total Orders', value: totalOrder },
        { title: 'Total Customer', value: TotalCustomer },
        { title: 'Pending Deliveries', value: pendingDeliveries },
        { title: 'Total Revenue', value: totalRevenue },
    ];

    const chartData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const orderCounts = orders.filter(
            (o) =>
                new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay
        ).length;

        chartData.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            orders: orderCounts,
        });
    }
    return (
        <AdminDashboardClient
            earning={{
                today: todayRevenue,
                sevenDays: sevenDaysRevenue,
                total: totalRevenue,
            }}
            stats={stats}
            chartData={chartData}
        />
    );
}

export default AdminDashboard;
