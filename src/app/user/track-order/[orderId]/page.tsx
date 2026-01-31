'use client';
import LiveMap from '@/components/LiveMap';
import { getSocket } from '@/lib/socket';
import { IUSER } from '@/model/user.model';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import { IMessage } from '@/model/message.model';
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
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
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

    useEffect(() => {
        const socket = getSocket();
        socket.emit('join-room', orderId);
        socket.on('send-message', (message) => {
            console.log('send message data', message);
            if (message.roomId.toString() === orderId?.toString()) {
                setMessages((prev) => [...prev!, message]);
            }
        });
        return () => {
            socket.off('join-room');
            socket.off('send-message');
        };
    }, []);

    const sendMsg = async () => {
        const socket = getSocket();
        const message = {
            roomId: orderId,
            text: newMessage,
            senderId: userData?._id,
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        socket.emit('send-message', message);
        setNewMessage('');
    };

    useEffect(() => {
        const getAllMessages = async () => {
            try {
                const result = await axios.post(`/api/chat/messages`, {
                    roomId: orderId,
                });

                console.log('message ', result.data);
                setMessages(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllMessages();
    }, []);

    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const getSuggestion = async () => {
        setLoading(true);
        try {
            const lastMsg = messages
                ?.filter(
                    (m) => m.senderId.toString() !== userData?._id?.toString()
                )
                .at(-1);
            const result = await axios.post(`/api/chat/ai-suggestions`, {
                message: lastMsg?.text,
                role: 'user',
            });
            console.log('result data gemini', result.data);

            setSuggestions(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

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

                    <div className=" mt-3 bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-graay-700 text-sm">
                                Quick Replies
                            </span>
                            <motion.button
                                onClick={getSuggestion}
                                disabled={loading}
                                whileTap={{ scale: 0.9 }}
                                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200"
                            >
                                <Sparkle size={14} />{' '}
                                {loading ? (
                                    <Loader className="w-5 h-5 animate-spin " />
                                ) : (
                                    'AI suggest'
                                )}
                            </motion.button>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-3">
                            {suggestions.map((s, i) => (
                                <motion.div
                                    key={s}
                                    whileTap={{ scale: 0.92 }}
                                    className="px-3 py-1 text-xs bg-green-50  cursor-pointer border-green-200 text-green-700 rounded-full"
                                    onClick={() => setNewMessage(s)}
                                >
                                    {s}
                                </motion.div>
                            ))}
                        </div>
                        <div
                            className="flex-1 overflow-y-auto p-2 space-y-3"
                            ref={chatBoxRef}
                        >
                            <AnimatePresence>
                                {messages?.map((msg, index) => (
                                    <motion.div
                                        key={msg._id?.toString()}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${msg.senderId.toString() === userData?._id?.toString() ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                                                msg.senderId.toString() ===
                                                userData?._id?.toString()
                                                    ? 'bg-green-600 text-white rounded-br-none '
                                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                        >
                                            <p className="">{msg.text}</p>
                                            <p className="text-[10px] opacity-70 mt-1 text-right">
                                                {msg.time}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-2 mt-3 border-t pt-3">
                            <input
                                type="text"
                                placeholder="type a message"
                                className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
                                onClick={sendMsg}
                            >
                                <Send size={18} />{' '}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;
