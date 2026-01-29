'use client';
import { getSocket } from '@/lib/socket';
import { IDeliveryAssignment } from '@/model/deliveryAssignment.model';
import { RootState } from '@/redux/store';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LiveMap from './LiveMap';

interface ILocation {
    latitude: number;
    longitude: number;
}
function DeliveryBoyDashboard() {
    const [assignments, setAssignments] = useState<any[]>();
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<ILocation>({
        latitude: 0,
        longitude: 0,
    });
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
        latitude: 0,
        longitude: 0,
    });
    const { userData } = useSelector((state: RootState) => state.user);
    const fetchAssignments = async () => {
        try {
            const result = await axios.get(`/api/delivery/get-assignments`);
            console.log(result);
            setAssignments(result.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect((): any => {
        const socket = getSocket();
        socket.on('new-assignment', (data) => {
            setAssignments((prev) => [...prev!, data]);
        });
        return () => socket.off('new-assignment');
    }, []);

    const handleAccept = async (id: string) => {
        try {
            const result = await axios.get(
                `/api/delivery/assignment/${id}/accept-assignment`
            );
            console.log(result);
        } catch (error) {
            console.log('error', error);
        }
    };

    const fetchCurrentOrder = async () => {
        try {
            const result = await axios.get(`/api/delivery/current-order`);
            const response = await result.data;
            if (response.active) {
                setActiveOrder(response.assignment);
                setUserLocation({
                    latitude: response.assignment.order.address.latitude,
                    longitude: response.assignment.order.address.longitude,
                });
            }
            console.log('result', result.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchAssignments(), fetchCurrentOrder()]);
        };

        loadData();
    }, [userData]);

    useEffect(() => {
        const socket = getSocket();
        if (!userData?._id) return;
        if (!navigator.geolocation) return;

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setDeliveryBoyLocation({ latitude: lat, longitude: lon });
                socket.emit('update-location', {
                    userId: userData?._id,
                    latitude: lat,
                    longitude: lon,
                });
            },
            (err) => {
                console.log('error in geo updater :: ', err);
            },
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watcher);
    }, [userData?._id]);

    if (activeOrder && userLocation) {
        return (
            <div className="p-4 pt-[120px] min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-green-700 mb-2">
                        Active Delivery
                    </h1>
                    <p className="text-sm  text-gray-600 mb-4">
                        order # {activeOrder.order._id.slice(-6)}
                    </p>

                    <div className="rounded-xl  border shadow-lg  overflow-hidden mb-6">
                        <LiveMap
                            userLocation={userLocation}
                            deliveryBoyLocation={deliveryBoyLocation}
                        />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">
                    Delivery Assignment
                </h2>
                {assignments?.map((a) => (
                    <div
                        className="p-5 bg-white rounded-xl shadow mb-4  border"
                        key={a._id}
                    >
                        <p className="text-gray-800">
                            <b>Order Id</b> #{a?.order._id.slice(-6)}
                        </p>
                        <p className="text-gray-600">
                            {a.order.address.fullAddress}
                        </p>
                        <div className="flex gap-3 mt-4">
                            <button
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                onClick={() => handleAccept(a._id)}
                            >
                                Accept
                            </button>
                            <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeliveryBoyDashboard;
