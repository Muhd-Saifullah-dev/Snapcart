'use client'
import { ArrowLeft, EyeIcon, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"
import googleImage from "@/assets/pngwing.com.png"
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
type propType={
 previousStep:(s:number)=>void
}
function RegisterForm({previousStep}:propType) {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [showpassword,setShowpassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const router=useRouter()
  const handleRegister=async(e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const result=await axios.post("/api/auth/register",{
        name,
        email,
        password
      })
      console.log(result.data.data)
      console.log(result.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>

      <div className='absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-color cursor-pointer' onClick={()=>previousStep(1)}>
        <ArrowLeft className='h-5 w-5'/>
        <span className='font-medium'>Back</span>
      </div>


      <motion.h1 className='text-4xl font-extrabold text-green-700 mb-2'
      initial={{
        y:-10,
        opacity:0
      }}
      animate={{
        y:0,
        opacity:1
      }}
      
      transition={{
        duration:0.6
      }}
      >
      Create Account
      </motion.h1>
      <p className='text-gray-600 flex items-center mb-8'>Join snapcart today <Leaf className='w-5 h-5 text-green-600'/>  </p>

      <motion.form 
      onSubmit={handleRegister}
       initial={{
        opacity:0
      }}
      animate={{
     
        opacity:1
      }}
      
      transition={{
        duration:0.6
      }}
      className='flex flex-col gap-5 w-full max-w-sm '>
        <div className='relative'>
        <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type='text' placeholder='Your name' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
          onChange={(e)=>setName(e.target.value)}
        value={name}/>
        </div> 
         <div className='relative'>
        <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type='text' placeholder='Your email' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
      onChange={(e)=>setEmail(e.target.value)}
      value={email}
        />

        </div> 
        <div className='relative'>
        <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type={showpassword?"text":"password"} placeholder='Your password' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        />
        {
          showpassword?<EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer' onClick={()=>setShowpassword(!showpassword)}/> : <EyeIcon className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-point' onClick={()=>setShowpassword(!showpassword)}/>
        }
        </div>
        {
          (()=>{
            const formValidation=name!=="" && email!=="" && password!==""
            return <button disabled={!formValidation || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${formValidation ? "bg-green-600 hover:bg-green-700 text-white":"bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
              {
                loading?<Loader2 className='w-5 h-5 animate-spin'/> :  "Register"
              }
             </button>
          })()
        }


      {/*  divider */}
        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-400'></span>
          OR
          <span  className='flex-1 h-px bg-gray-400'></span>
        </div>
        <button className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200'>
          <Image alt='google image' src={googleImage} width={20} height={20}/> 
          Continue with google
        </button>
      </motion.form>

      <p  className='cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1'>Already have an account ? <LogIn className='w-4 h-4'/> <span className='text-green-600' onClick={()=>router.push("/login")}>Sign in</span> </p>
    </div>
  )
}

export default RegisterForm