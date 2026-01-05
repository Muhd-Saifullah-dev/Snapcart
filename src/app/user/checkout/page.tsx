'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import {
    ArrowLeft,
    Building,
    CreditCard,
    CreditCardIcon,
    Home,
    Loader2,
    LocateFixed,
    MapPin,
    Navigation,
    Phone,
    Search,
    Truck,
    User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const markerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

function Checkout() {
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user);
    const { finalTotal, subTotal, deliveryFee ,cartData} = useSelector(
        (state: RootState) => state.cart
    );
    const [address, setAddress] = useState({
        fullName: '',
        mobile: '',
        city: '',
        state: '',
        pincode: '',
        fullAddress: '',
    });
    const [searchquery, setSearchQuery] = useState('');
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                },
                (err) => {
                    console.log('location error ', err);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        }
    }, []);

    useEffect(() => {
        if (userData) {
            setAddress((prev) => ({ ...prev, fullName: userData.name || '' }));
            setAddress((prev) => ({ ...prev, mobile: userData.mobile || '' }));
        }
    }, [userData]);

    const DraggableMarker: React.FC = () => {
        const map = useMap();
        useEffect(() => {
            map.setView(position as LatLngExpression, 16, { animate: true });
        }, [position, map]);

        return (
            <Marker
                icon={markerIcon}
                position={position as LatLngExpression}
                draggable={true}
                eventHandlers={{
                    dragend: (e: L.LeafletEvent) => {
                        const marker = e.target as L.Marker;
                        const { lat, lng } = marker.getLatLng();
                        setPosition([lat, lng]);
                    },
                }}
            />
        );
    };

    useEffect(() => {
        if (!position) return;

        const timer = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `/api/reverse-geocode?lat=${position[0]}&lon=${position[1]}`
                );
                console.log(res.data);
                setAddress((prev) => ({
                    ...prev,
                    city: res.data.address.city,
                    state: res.data.address.state,
                    pincode: res.data.address.postcode,
                    fullAddress: res.data.display_name,
                }));
            } catch (e) {
                console.log(e);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [position]);

    const handleSearchQuery = async () => {
        if (!searchquery) return;
        setSearchLoading(true);
        try {
            const res = await fetch(`/api/geocode-search?q=${searchquery}`);
            const data = await res.json();

            console.log('search result', data);
            if (!data) return;

            if (data.length > 0) {
                const lat = Number(data[0].lat);
                const lon = Number(data[0].lon);
                setSearchLoading(false);
                setPosition([lat, lon]);
            }
        } catch (err) {
            console.error('search error', err);
            setSearchLoading(false);
        }
    };

    const handleCod=async()=>{
        if(!position) {
            return  null
        }
        try {
            const result=await axios.post("/api/user/order",{
                userId:userData?._id,
                items:cartData.map(item=>({
                    grocery:item._id,
                    name:item.name,
                    price:item.price,
                    unit:item.unit,
                    quantity:item.quantity,
                    image:item.image
                })),
                totalAmount:finalTotal,
                address:{
                    fullName:address.fullName,
                    mobile:address.mobile,
                    pincode:address.pincode,
                    state:address.state,
                    city:address.city,
                    fullAddress:address.fullAddress,
                    latitude:position[0],
                    longitude:position[1]

                },
                paymentMethod
            })
            console.log("result in order place ",result.data)
        } catch (error) {
            console.error(`error in place order ${error}`)
        }
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                },
                (err) => {
                    console.log('location error ', err);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        }
    };

    return (
        <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
            <motion.button
                whileTap={{ scale: 0.97 }}
                className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
                onClick={() => router.push('/user/cart')}
            >
                <ArrowLeft size={16} />
                <span>Back to cart</span>
            </motion.button>
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
            >
                Checkout
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 ">
                        <MapPin className="text-green-700" /> Delivery Address
                    </h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <User
                                className="absolute left-3 top-3 text-green-600"
                                size={18}
                            />
                            <input
                                type="text"
                                value={address.fullName}
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        fullName: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="relative">
                            <Phone
                                className="absolute left-3 top-3 text-green-600"
                                size={18}
                            />
                            <input
                                type="text"
                                value={address.mobile}
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        mobile: e.target.value,
                                    }))
                                }
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                            />
                        </div>

                        <div className="relative">
                            <Home
                                className="absolute left-3 top-3 text-green-600"
                                size={18}
                            />
                            <input
                                type="text"
                                value={address.fullAddress}
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        fullAddress: e.target.value,
                                    }))
                                }
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                placeholder="full address"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Building
                                    className="absolute left-3 top-3 text-green-600"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }))
                                    }
                                    className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                    placeholder="city"
                                />
                            </div>

                            <div className="relative">
                                <Navigation
                                    className="absolute left-3 top-3 text-green-600"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={address.state ?? ''}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
                                    className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                    placeholder="state"
                                />
                            </div>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-3 text-green-600"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={address.pincode ?? ''}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            pincode: e.target.value,
                                        }))
                                    }
                                    className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                    placeholder="pincode"
                                />
                            </div>
                        </div>

                        {/* search bar */}
                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                placeholder="search city or area "
                                className="flex-1 border rounded-lg  p-3 text-sm focus:ring-2  focus:ring-green-500 outline-none "
                                value={searchquery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className="bg-green-600 text-white px-5 rounded-lg hover:green-700 transition-all font-medium"
                                onClick={handleSearchQuery}
                            >
                                {searchLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </div>

                        {/* map div  */}
                        <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                            {position && (
                                <MapContainer
                                    center={position as LatLngExpression}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    className="w-full h-full"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <DraggableMarker />
                                </MapContainer>
                            )}
                            <motion.button
                                onClick={handleCurrentLocation}
                                whileTap={{ scale: 0.97 }}
                                className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999"
                            >
                                <LocateFixed size={22} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-gray-100 h-fit"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="text-green-600" />
                        Payment Method{' '}
                    </h2>

                    <div className="space-y-4 mb-6">
                        <button
                            onClick={() => setPaymentMethod('online')}
                            className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === 'online' ? 'border-green-600 bg-green-50 shadow-sm' : 'hover:bg-gray-50'}`}
                        >
                            <CreditCardIcon className="text-green-600 " />
                            <span className="font-medium text-gray-700">
                                Pay Online (stripe)
                            </span>
                        </button>

                        <button
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50 shadow-sm' : 'hover:bg-gray-50'}`}
                        >
                            <Truck className="text-green-600 " />
                            <span className="font-medium text-gray-700">
                                Cash on Delivery
                            </span>
                        </button>
                    </div>
                    <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between">
                            <span className="font-semibold">Subtotal</span>
                            <span className="text-green-600 font-semibold">
                                ${subTotal}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Delivery Fee</span>
                            <span className="text-green-600 font-semibold">
                                ${deliveryFee}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-3">
                            <span>Final Total</span>
                            <span className="text-green-600 font-semibold">
                                ${finalTotal}
                            </span>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold"
                            onClick={()=>{if(paymentMethod==="cod"){
                                handleCod()
                            }else{
                                null
                                // handleOnlineOrder()
                            }
                        }}
                   >
                        {paymentMethod === 'cod'
                            ? 'Place Order'
                            : 'Pay & Place Order'}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

export default Checkout;
