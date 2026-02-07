'use client';
import { getSocket } from '@/lib/socket';
import { IDeliveryAssignment } from '@/model/deliveryAssignment.model';
import { RootState } from '@/redux/store';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LiveMap from './LiveMap';
import DeliveryChat from './DeliveryChat';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';
import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ILocation {
    latitude: number;
    longitude: number;
}
function DeliveryBoyDashboard({ earning }: { earning: number }) {
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

    const [showOtpBox, setShowOtpBox] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [sendOtpLoading, setSendOtpLoading] = useState(false);
    const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

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
            await fetchCurrentOrder();
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
        const socket = getSocket();
        socket.on('update-delivery-location', ({ userId, location }) => {
            setDeliveryBoyLocation({
                latitude: location.coordinates[1],
                longitude: location.coordinates[0],
            });
        });
        return () => {
            socket.off('update-delivery-location');
        };
    }, []);
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
                if (err.code === 1) {
                    alert(
                        'Location access is required to deliver orders. Please allow location access.'
                    );
                }
                console.log('error in geo updater :: ', err);
            },
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watcher);
    }, [userData?._id]);

    const sendOtp = async () => {
        setSendOtpLoading(true);
        try {
            const result = await axios.post(`/api/delivery/otp/send`, {
                orderId: activeOrder.order._id,
            });
            console.log('result send otp', result);
            setSendOtpLoading(false);
            setShowOtpBox(true);
        } catch (error) {
            toast.error('send otp error');
            setShowOtpBox(true);
        }
    };

    const verifyOtp = async () => {
        setVerifyOtpLoading(true);
        try {
            const result = await axios.post(`/api/delivery/otp/verify`, {
                orderId: activeOrder.order._id,
                otp,
            });
            setActiveOrder(null);
            console.log('result verify otp', result);
            setVerifyOtpLoading(false);
            setShowOtpBox(true);
            await fetchCurrentOrder();
            await fetchAssignments();
        } catch (error) {
            setOtpError('otp verification error');
            setVerifyOtpLoading(false);
            console.log(error);
        }
    };

    if (!activeOrder && assignments?.length === 0) {
        const todayEarning = [
            { name: 'Today', earning: earning, deliveries: earning / 40 },
        ];
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        No Active Deliveries 🚚
                    </h2>
                    <p className="text-gray-500 mb-5">
                        Stay online to recieve new orders
                    </p>

                    <div className="bg-white border rounded-xl shadow-xl p-6">
                        <h2 className="font-medium text-green-700 mb-2">
                            Today's Performance
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={todayEarning}>
                                <XAxis dataKey="name" />
                                <YAxis tickCount={4} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="earning" name="Earning ($)" />
                                <Bar dataKey="deliveries" name="Deliveries" />
                            </BarChart>
                        </ResponsiveContainer>

                        <p className="mt-4 text-lg font-bold text-green-700 ">
                            {earning || 0} Earned today
                        </p>
                        <button
                            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Earning
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (activeOrder && userLocation) {
        return (
            <div className="p-4 pt-[120px] min-h-screen ">
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

                    <DeliveryChat
                        orderId={activeOrder.order._id.toString()}
                        deliveryBoyId={String(userData?._id!)}
                    />

                    <div className="mt-6 bg-white rounded-xl border shadow p-6">
                        {!activeOrder.order.deliveryOtpVerification &&
                            !showOtpBox && (
                                <button
                                    onClick={sendOtp}
                                    className="w-full  text-center py-4 bg-green-600 text-white rounded-lg flex items-center justify-center"
                                >
                                    {' '}
                                    {sendOtpLoading ? (
                                        <Loader
                                            size={16}
                                            className="animate-spin text-white "
                                        />
                                    ) : (
                                        'Mark as Delivered'
                                    )}{' '}
                                </button>
                            )}

                        {showOtpBox && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                    className="w-full py-3 border rounded-lg text-center"
                                    placeholder="Enter your otp"
                                    maxLength={6}
                                    minLength={6}
                                />
                                <button
                                    className="w-full mt-2 bg-blue-600  text-center hover:bg-blue-700 text-white py-4 rounded-lg flex items-center justify-center"
                                    onClick={verifyOtp}
                                >
                                    {' '}
                                    {verifyOtpLoading ? (
                                        <Loader
                                            size={18}
                                            className="animate-spin text-white  text-center"
                                        />
                                    ) : (
                                        ' Verify Otp'
                                    )}{' '}
                                </button>
                                {otpError && (
                                    <div className="text-red-600 mt-2 text-xs ">
                                        {otpError}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeOrder.order.deliveryOtpVerification && (
                            <div className="text-green-700 text-center font-bold">
                                Delivery completed!
                            </div>
                        )}
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
                {assignments?.map((a, index) => (
                    <div
                        className="p-5 bg-white rounded-xl shadow mb-4  border"
                        key={index}
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
