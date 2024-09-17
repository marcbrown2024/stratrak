'use client'

// react/nextjs components
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';

// icons
import { HiArrowSmallLeft, HiArrowSmallRight } from "react-icons/hi2";

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
    <div className='fixed top-20 w-9/12 2xl:w-[80%] flex justify-between space-x-4 pl-12 pr-8'>
      <button 
      onClick={handleBack}
      className='hover:text-gray-500 border rounded p-2 active:scale-90 duration-200'>
        <HiArrowSmallLeft size={24} />
      </button>
      
      <button 
      onClick={handleForward}
      className='hover:text-gray-500 border rounded p-2 active:scale-90 duration-200'>
        <HiArrowSmallRight size={24} />
      </button>
    </div>
  )
}

export default SiteNavBtns