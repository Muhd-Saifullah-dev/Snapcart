'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowLeft,
    Loader2,
    Package,
    Pencil,
    Search,
    Upload,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IGrocery } from '@/model/grocery.model';
import Image from 'next/image';

const categories = [
    'Fruits & Vegetable',
    'Dairy & Eggs',
    'Rice, Atta & Grains',
    'Snacks & Biscuits',
    'Spices & Masalas',
    'Beverages & Drinks',
    'Personal Care',
    'Household Essentials',
    'Instant & Packaged Food',
    'Baby & Pet Care',
];
const units = ['kg', 'g', 'liter', 'ml', 'piece', 'pack'];

function ViewGrocery() {
    const router = useRouter();
    const [groceries, setGroceries] = useState<IGrocery[]>();
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState<IGrocery | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [backendImage, setBackendImage] = useState<Blob | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteloading] = useState(false);
    const [filtered, setFiltered] = useState<IGrocery[]>();
    useEffect(() => {
        const getGroceries = async () => {
            try {
                const result = await axios.get(`/api/admin/get-groceries`);
                setGroceries(result.data);
                setFiltered(result.data);
            } catch (error) {
                console.log(`error in useEffect getGroceries : ${error}`);
            }
        };
        getGroceries();
    }, []);
    useEffect(() => {
        if (editing) {
            setImagePreview(editing.image);
        }
    }, [editing]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackendImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const hanleEdit = async () => {
        setLoading(true);
        if (!editing) return;

        try {
            const formData = new FormData();
            formData.append('groceryId', editing?._id?.toString()!);
            formData.append('name', editing?.name);
            formData.append('category', editing.category);
            formData.append('price', editing.price);
            formData.append('unit', editing.unit);
            if (backendImage) {
                formData.append('image', backendImage);
            }
            const result = await axios.patch(
                `/api/admin/edit-grocery`,
                formData
            );
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDeleteGrocery = async () => {
        setDeleteloading(true);
        if (!editing) return;
        try {
            const result = await axios.delete('/api/admin/delete-grocery', {
                data: { groceryId: editing._id },
            });
            setDeleteloading(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            setDeleteloading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) {
            setFiltered(groceries);
        }
        const q = search.toLowerCase();
        setFiltered(
            groceries?.filter(
                (g) =>
                    g.name.toLowerCase().includes(q) ||
                    g.category.toLowerCase().includes(q)
            )
        );
    };
    return (
        <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
            >
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center  justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
                >
                    {' '}
                    <ArrowLeft size={18} /> <span>Back</span>{' '}
                </button>
                <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
                    {' '}
                    <Package size={28} className="texxt-green-600" /> Manage
                    Groceries
                </h1>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSearch}
                className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
            >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <input
                    type="text"
                    className="w-full outline-none text-gray-700 placeholder-gray-400"
                    placeholder="search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </motion.form>

            <div className="space-y-4">
                {filtered?.map((g, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
                    >
                        <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <Image
                                src={g.image}
                                alt={g.name}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-between w-full">
                            <div>
                                <h3 className="font-semibold text-gray-800 text-lg truncate">
                                    {g.name}
                                </h3>
                                <p className="text-gray-500 text-sm capitalize">
                                    {g.category}
                                </p>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="text-green-700 font-bold text-lg">
                                    ${g.price}/{' '}
                                    <span className="text-gray-500 text-sm font-medium ml-1">
                                        {g.unit}
                                    </span>
                                </p>

                                <button
                                    onClick={() => setEditing(g)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                                >
                                    <Pencil size={15} /> Edit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex  items-center justify-center z-50 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-7 "
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-green-700">
                                    Edit Grocery
                                </h2>

                                <button
                                    className="text-gray-600 hover:text-red-600"
                                    onClick={() => setEditing(null)}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                                {imagePreview && (
                                    <Image
                                        src={imagePreview}
                                        alt={editing.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <label
                                    htmlFor="imageUpload"
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                >
                                    {' '}
                                    <Upload
                                        size={28}
                                        className="text-green-500"
                                    />{' '}
                                </label>
                                <input
                                    type="file"
                                    accept="images/*"
                                    hidden
                                    id="imageUpload"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editing.name}
                                    placeholder="Enter Grocery name"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none "
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white "
                                    value={editing.category}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            category: e.target.value,
                                        })
                                    }
                                >
                                    <option>Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={editing.price}
                                    placeholder="Price"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none "
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            price: e.target.value,
                                        })
                                    }
                                />

                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white "
                                    value={editing.unit}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            unit: e.target.value,
                                        })
                                    }
                                >
                                    <option>Select Unit</option>
                                    {units.map((u, index) => (
                                        <option key={index} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 ">
                                <button
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all"
                                    onClick={hanleEdit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2
                                            size={14}
                                            className=" animate-spin"
                                        />
                                    ) : (
                                        'Edit Grocery'
                                    )}
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700  transition"
                                    onClick={handleDeleteGrocery}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        'Delete Grocery'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ViewGrocery;
