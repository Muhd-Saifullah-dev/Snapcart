'use client';
import { Loader, Send, Sparkle } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { IMessage } from '@/model/message.model';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
type TProps = {
    orderId: mongoose.Types.ObjectId;
    deliveryBoyId: string;
};
function DeliveryChat({ orderId, deliveryBoyId }: TProps) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        const socket = getSocket();
        socket.emit('join-room', orderId);
        socket.on('send-message', (message) => {
            console.log('send message data', message);
            if (message.roomId === orderId) {
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
            senderId: deliveryBoyId,
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
                    (m) => m.senderId.toString() !== deliveryBoyId.toString()
                )
                .at(-1);
            const result = await axios.post(`/api/chat/ai-suggestions`, {
                message: lastMsg?.text,
                role: 'delivery_boy',
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
        <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
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
                            className={`flex ${msg.senderId.toString() === deliveryBoyId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                                    msg.senderId.toString() === deliveryBoyId
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
    );
}

export default DeliveryChat;
