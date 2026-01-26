'use client';
import { IDeliveryAssignment } from '@/model/deliveryAssignment.model';
import axios from 'axios';
import { div } from 'motion/react-client';
import React, { useEffect, useState } from 'react';

function DeliveryBoyDashboard() {
    const [assignments, setAssignments] = useState<any[]>();
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const result = await axios.get(`/api/delivery/get-assignments`);
                console.log(result);
                setAssignments(result.data);
            } catch (error) {
                console.log('error', error);
            }
        };
        fetchAssignments();

        return () => setAssignments([]);
    }, []);
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
                            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
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
