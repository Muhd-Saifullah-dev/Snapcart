'use client';

import axios from 'axios';
import { ArrowLeft, LoaderCircle, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import UserOrderCard from '@/components/UserOrderCard';
import mongoose from 'mongoose';
import { IUSER } from '@/model/user.model';
import { getSocket } from '@/lib/socket';

interface IOrder {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: [
        {
            grocery: mongoose.Types.ObjectId;
            name: string;
            price: string;
            unit: string;
            image: string;
            quantity: number;
        },
    ];
    isPaid: boolean;
    totalAmount: number;
    paymentMethod: 'cod' | 'online';
    address: {
        fullName: string;
        city: string;
        mobile: string;
        state: string;
        pincode: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
    };
    assignment?: mongoose.Types.ObjectId;
    assignedDeliveryBoy?: IUSER;
    status: 'pending' | 'out of delivery' | 'delivered';
    createdAt?: Date;
    updatedAt?: Date;
}

function MyOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getMyOrders = async () => {
            try {
                const result = await axios.get('/api/user/my-orders');
                console.log('result get my order', result.data);
                setLoading(false);
                setOrders(result.data);
            } catch (error) {
                console.log('error in my order useEffect ', error);
                setLoading(false);
            }
        };

        getMyOrders();

        return () => {
            setOrders([]);
        };
    }, []);


    useEffect(()=>{
        const socket=getSocket()
        socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
            setOrders((prev)=>prev?.map((o)=>(
                o._id===orderId?{...o,assignedDeliveryBoy}:o
            )))
        })

        return ()=>{
            socket.off("order-assigned")
        }
    },[])



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
                {' '}
                <LoaderCircle
                    size={40}
                    className="text-gray-600 animate-spin"
                />{' '}
            </div>
        );
    }

    return (
        <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
                <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50 ">
                    <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
                        <button
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
                            onClick={() => router.push('/')}
                        >
                            <ArrowLeft size={24} className="text-green-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 ">
                            My Orders
                        </h1>
                    </div>
                </div>

                {orders?.length === 0 ? (
                    <div className="pt-20 flex flex-col items-center text-center">
                        <PackageSearch
                            size={70}
                            className="text-green-600 mb-4"
                        />
                        <h2 className="text-xl font-semibold text-gray-700">
                            No Orders Found
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Start shopping to view your orders here.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-6 ">
                        {orders?.map((order, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <UserOrderCard order={order} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
