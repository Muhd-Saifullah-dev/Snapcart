import mongoose from 'mongoose';
import Grocery from './grocery.model';

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
    totalAmount: string;
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
    status: 'pending' | 'out of delivery' | 'delivered';
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                grocery: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Grocery',
                    required: true,
                },
                name: String,
                price: String,
                unit: String,
                image: String,
                quantity: Number,
            },
        ],
        paymentMethod: {
            type: String,
            enum: ['cod', 'online'],
            default: 'cod',
        },
        address: {
            fullAddress: String,
            mobile: String,
            city: String,
            state: String,
            pincode: String,
            fullName: String,
            latitude: Number,
            longitude: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'out of delivery', 'delivered'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
