'use client'

import { useAlertStore } from '@/store/AlertStore'
import React, { useEffect } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { MdClose } from "react-icons/md";
import { AlertType } from '@/enums';
import { TiTick } from "react-icons/ti";
import { IoAlert } from "react-icons/io5";

const Alert = () => {
  const [showAlert, body, alertType, closeAlert] = useAlertStore(state => [state.showAlert, state.body, state.alertType, state.closeAlert])
  
  useEffect(() => {
    setTimeout(() => {
      closeAlert()
    }, 5000)
  }, [showAlert, closeAlert])

  return (
    <AnimatePresence>
      {showAlert &&
        <motion.div 
          key="alert"
          initial={{
            right: "0",
            opacity: "0"
          }}
          animate={{
            right: "2rem",
            opacity: "1",
          }}
  
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
  
          exit={{
            opacity: "0",
          }}
  
          className={`z-[1000000] p-2 absolute bottom-20 -right-50 flex w-96 h-fit bg-white shadow-xl border-t-2 
            ${alertType == AlertType.Success ? "border-emerald-500 text-emerald-500" : 
              alertType == AlertType.Error && "border-rose-500 text-rose-500" }
          `}>
          {/* alert body */}
          <div className={`relative w-full`}>
            {/* alert heading */}
            <div className='flex items-center space-x-2 font-bold'>
              {
                alertType == AlertType.Success ?
                <span className='rounded-full bg-emerald-500 text-white'>
                  <TiTick />   
                </span>
                :
                <span className='rounded-full bg-rose-500 text-white'>
                  <IoAlert />
                </span>
              }
              <p className='flex-1'>{body.title}</p>
              <button onClick={closeAlert} className=''><MdClose className='' fontWeight={500} /></button>
            </div>
            {/* alert body content */}
            <p className='px-6 text-black text-sm text-wrap'>{body.content}</p>
          </div>
        </motion.div>
      }

    </AnimatePresence>
  )
}

export default Alert