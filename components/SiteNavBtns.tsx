'use client'

import React, { useEffect } from 'react'
import { HiArrowUturnLeft, HiArrowUturnRight } from "react-icons/hi2";
import { usePathname, useRouter } from 'next/navigation';

const SiteNavBtns = () => {
  const pathname = usePathname()

  const router = useRouter(); // Initialize the useRouter hook

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/'); // Redirect to the homepage or another default page
    }
  };

  const handleForward = () => {
    router.forward(); // Use the router's back method to go to the previous page
  };

  return pathname !== '/login' && (
    <div className='absolute w-full flex justify-between space-x-4 top-7 px-8'>
      <button 
      onClick={handleBack}
      className='hover:text-blue-500 border rounded p-2 active:scale-90 duration-200'>
        <HiArrowUturnLeft className='text-xl' />
      </button>
      
      <button 
      onClick={handleForward}
      className='hover:text-blue-500 border rounded p-2 active:scale-90 duration-200'>
        <HiArrowUturnRight className='text-xl' />
      </button>
    </div>
  )
}

export default SiteNavBtns