'use client';
import LiveMap from '@/components/LiveMap';
import { getSocket } from '@/lib/socket';
import { IUSER } from '@/model/user.model';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

interface ILocation {
    latitude: number;
    longitude: number;
}

function TrackOrder({ params }: { params: { orderId: string } }) {
    const { orderId } = useParams();
    const { userData } = useSelector((state: RootState) => state.user);
    const [order, setOrder] = useState<IOrder>();
    const [userLocation, setUserLocation] = useState<ILocation>({
        latitude: 0,
        longitude: 0,
    });
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
        latitude: 0,
        longitude: 0,
    });

    const router = useRouter();
    useEffect(() => {
        const getOrder = async () => {
            try {
                const result = await axios.get(
                    `/api/user/get-order/${orderId}`
                );
                const data = await result.data;
                setOrder(data);
                setUserLocation({
                    latitude: data.address.latitude,
                    longitude: data.address.longitude,
                });

                setDeliveryBoyLocation({
                    latitude: data.assignedDeliveryBoy.location.coordinates[1],
                    longitude: data.assignedDeliveryBoy.location.coordinates[0],
                });
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        };
        getOrder();
    }, [userData?._id]);

    useEffect(() => {
        console.log('useEffect');
        const socket = getSocket();

        socket.on('update-delivery-location', ({ userId, location }) => {
            console.log('userId and location', userId, location);
            setDeliveryBoyLocation({
                latitude: location.coordinates[1],
                longitude: location.coordinates[0],
            });
        });
        return () => {
            socket.off('update-delivery-location');
        };
    }, [order]);
    return (
        <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
            <div className="max-w-2xl mx-auto pb-24">
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
                    <button
                        className="p-2 bg-green-100 rounded-full "
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="text-green-700" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">Track Order</h2>
                        <p className="text-sm text-gray-600">
                            order # {order?._id?.toString().slice(-6)}{' '}
                            <span className="text-green-700 font-semibold">
                                {order?.status}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="px-4 mt-6">
                    <div className="rounded-3xl overflow-hidden border shadow">
                        <LiveMap
                            userLocation={userLocation}
                            deliveryBoyLocation={deliveryBoyLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;
