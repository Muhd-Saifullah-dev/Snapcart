import React from 'react'

const unAuthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <h1 className='text-3xl font-bold text-red-600'>Access Denied 🚫</h1>
        <p className='mt-2 text-gray-700'>you cannot access this page </p>
    </div>
  )
}

export default unAuthorized