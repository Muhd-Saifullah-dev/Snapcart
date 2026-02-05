'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from "motion/react"
import { ArrowLeft, Package, Pencil, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IGrocery } from '@/model/grocery.model'
import Image from 'next/image'

function ViewGrocery() {
    const router=useRouter()
    const [groceries,setGroceries]=useState<IGrocery[]>()
    const [editing,setEditing]=useState<IGrocery | null>(null)
useEffect(()=>{
    const getGroceries=async()=>{
        try {
            const result=await axios.get(`/api/admin/get-groceries`)
        setGroceries(result.data)
        } catch (error) {
            console.log(`error in useEffect getGroceries : ${error}`)
        }
    }
    getGroceries()
},[])
  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
        <motion.div
        initial={{opacity:0,x:-20}}
        animate={{opacity:1,x:0}}
        transition={{duration:0.4}}
        className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left'
        >
            <button
            onClick={()=>router.push("/")}
            className='flex items-center  justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto'> <ArrowLeft size={18}/> <span>Back</span>  </button>
            <h1 className='text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2'> <Package size={28}  className='texxt-green-600' /> Manage Groceries</h1>
        </motion.div>

        <motion.form
        initial={{opacity:0,y:10}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
        className='flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full'
        >
            <Search className='text-gray-500 w-5 h-5 mr-2'/>
            <input type="text" className='w-full outline-none text-gray-700 placeholder-gray-400' placeholder='search by name or category...' />
        </motion.form>

    <div className='space-y-4'>
        {
            groceries?.map((g,i)=>(
                <motion.div key={i}
                whileHover={{scale:1.01}}
                transition={{type:"spring",stiffness:100}}
                className='bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all'
                >
                    <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200'>
                        <Image src={g.image} alt={g.name} fill
                        className='object-cover hover:scale-110 transition-transform duration-500'
                        />
                    </div>
                    <div className='flex-1 flex flex-col justify-between w-full'>
                        <div>
                            <h3 className='font-semibold text-gray-800 text-lg truncate'>{g.name}</h3>
                            <p className='text-gray-500 text-sm capitalize'>{g.category}</p>
                        </div>
                        <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <p className='text-green-700 font-bold text-lg'>${g.price}/ <span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span></p>

                            <button 
                            onClick={()=>setEditing(g)}
                            className='bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all'>
                            <Pencil size={15}/> Edit
                            </button>
                        </div>
                    </div>
                
                </motion.div>
            ))
        }
        </div>



        <AnimatePresence>

            {
                editing && (
                    <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}


                    className='fixed inset-0 bg-black/40 flex  items-center justify-center z-50 backdrop-blur-sm px-4'
                    >
                    
                    <motion.div
                    initial={{y:40,opacity:0}}
                    animate={{y:0,opacity:1}}
                    exit={{y:40,opacity:0}}
                    transition={{duration:0.3}}
                   className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-7 "
                    
                    >

                    </motion.div>

                    </motion.div>
                )
            }
        </AnimatePresence>










    </div>
  )
}

export default ViewGrocery