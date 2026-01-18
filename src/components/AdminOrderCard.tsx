'use client';
import { IOrder } from '@/model/order.model';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    ChevronDown,
    ChevronUp,
    CreditCard,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
} from 'lucide-react';
import Image from 'next/image';
function AdminOrderCard({ order }: { order: IOrder }) {
    const statusOption = ['pending', 'out of delivery'];
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            key={order._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all "
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-lg font-bold flex items-center gap-2 text-green-700">
                        <Package size={20} />
                        Order #{order._id?.toString().slice(-6)}
                    </p>
                    <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                            order.isPaid
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'bg-red-100 text-red-700 border-red-300'
                        }`}
                    >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt!).toLocaleString()}
                    </p>

                    <div className="mt-3 space-y-1 text-gray-700 text-sm">
                        <p className="flex items-center gap-2 font-semibold">
                            <User size={16} className="text-green-600" />
                            <span>{order.address.fullName}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold">
                            <Phone size={16} className="text-green-600" />
                            <span>{order.address.mobile}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold ">
                            <MapPin size={16} className="text-green-600" />
                            <span>{order.address.fullAddress}</span>
                        </p>
                    </div>
                    {/* payment  */}
                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-700 ">
                        <CreditCard
                            size={16}
                            className="text-green-600 shrink-0"
                        />
                        <span>
                            {order.paymentMethod === 'cod'
                                ? 'Cash On Delivery'
                                : 'Online Payment'}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                        {order.status}
                    </span>
                    <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none">
                        {statusOption.map((st) => (
                            <option key={st} value={st}>
                                {st.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3">
                <button
                    className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition "
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    <span className="flex items-center gap-2">
                        <Package size={16} className="text-green-600" />

                        {expanded
                            ? 'Hide Order Items'
                            : `View ${order.items.length} Items`}
                    </span>
                    {expanded ? (
                        <ChevronUp size={16} className="text-green-600" />
                    ) : (
                        <ChevronDown size={16} className="text-green-600" />
                    )}
                </button>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: expanded ? 'auto' : 0,
                        opacity: expanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="mt-3 space-y-3">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={100}
                                        height={48}
                                        className=" rounded-lg object-cover border border-gray-200"
                                    />
                                    <div className="">
                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500 ">
                                            {item.quantity} x {item.unit}
                                        </p>
                                    </div>
                                </div>
                                <p className="text font- text-gray-800">
                                    ${Number(item.price) * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between items-center text-sm  font-semibold text-gray-800">
                <div className="flex items-ccnter gap-2 text-gray-700 text-sm">
                    <Truck size={20} className="text-green-600" />
                    <span>
                        Delivery :{' '}
                        <span className="text-green-700 font-semibold">
                            {order.status}
                        </span>
                    </span>
                </div>
                <div className="">
                    total :{' '}
                    <span className="text-green-700 font-bold">
                        ${order.totalAmount}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default AdminOrderCard;
