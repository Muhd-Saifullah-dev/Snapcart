'use client';
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

import {
    CopyrightIcon,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';

// type IProps={
//   role:string | null
// }
function Footer({ userRole }: { userRole: string | null }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-linear-to-r from-green-600 to-green-700 text-white mt-20"
        >
            <div className="w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40">
                <div>
                    <h2 className="text-2xl font-bold mb-3">Snapcart</h2>
                    <p className="text-sm text-green-100 leading-relaxed">
                        Your one stop online grocery store delivering freshness
                        to your doorstep. shop smart, eat fresh, and save more
                        every day!
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3 ">Quick Links</h2>
                    <ul className="space-y-2 text-green-100 text-sm">
                        {userRole === 'admin' ? (
                            <>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/'}>Home</Link>{' '}
                                </li>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/admin/manage-order'}>
                                        Manage Orders
                                    </Link>{' '}
                                </li>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/admin/add-grocery'}>
                                        Add Grocery
                                    </Link>{' '}
                                </li>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/admin/view-grocery'}>
                                        View Grocery
                                    </Link>{' '}
                                </li>{' '}
                            </>
                        ) : (
                            <>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/'}>Home</Link>{' '}
                                </li>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/user/cart'}>Cart</Link>{' '}
                                </li>
                                <li className="hover:text-white transition">
                                    {' '}
                                    <Link href={'/user/my-orders'}>
                                        My Orders
                                    </Link>{' '}
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                    <ul className="space-y-2 text-green-100 text-sm ">
                        <li className="flex items-center gap-2 ">
                            <MapPin size={16} /> Karachi, Pakistan
                        </li>

                        <li className="flex items-center gap-2 ">
                            <Phone size={16} /> +92 000000000
                        </li>
                        <li className="flex items-center gap-2 ">
                            <Mail size={16} /> support@snapcart.pk
                        </li>
                    </ul>

                    {/* social links */}
                    <div className="flex gap-4 mt-4">
                        <Link href={'https://facebook.com'} target="_blank">
                            <Facebook className="hover:text-white w-5 h-5 transition" />
                        </Link>

                        <Link href={'https://instagram.com'} target="_blank">
                            <Instagram className="hover:text-white w-5 h-5 transition" />
                        </Link>

                        <Link href={'https://twitter.com'} target="_blank">
                            <Twitter className="hover:text-white w-5 h-5 transition" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="text-center py-4 text-sm text-green-100 bg-green-800/40 flex items-center justify-center gap-1">
                <CopyrightIcon size={18} /> {new Date().getFullYear()}{' '}
                <span className="font-semibold">Snapcart</span>. All rights
                reserved
            </div>
        </motion.div>
    );
}

export default Footer;
