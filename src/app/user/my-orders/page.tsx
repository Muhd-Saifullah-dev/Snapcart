'use client';
import { IOrder } from '@/model/order.model';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function MyOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>();
    useEffect(() => {
        const getMyOrders = async () => {
            try {
                const result = await axios.get('/api/user/my-orders');
                console.log('result get my order', result.data);
                setOrders(result.data);
            } catch (error) {
                console.log('error in my order useEffect ', error);
            }
        };

        getMyOrders();

        return () => {
            setOrders([]);
        };
    }, []);

    return (
        <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
                <div className="fixed top=0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50 ">
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
            </div>
        </div>
    );
}

export default MyOrders;
