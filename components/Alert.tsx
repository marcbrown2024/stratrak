'use client'

import { useAlertStore } from '@/store/AlertStore'
import React, { useEffect } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { IoCloseCircleSharp } from "react-icons/io5";

const Alert = () => {
  const [showAlert, body, alertType, closeAlert] = useAlertStore(state => [state.showAlert, state.body, state.alertType, state.closeAlert])
  
  // useEffect(() => {
  //   setTimeout(() => {
  //     closeAlert()
  //   }, 5000)
  // }, [])

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
  
          className={`absolute bottom-40 -right-50 flex w-fit min-w-48 h-fit bg-white`}>
          <div className={`bg-emerald-500 w-10 rounded-l-lg`} />  
          <div className={`px-4 py-4 relative w-full`}>
            {body}
            <button className='absolute top-1 right-1 opacity-3 0 hover:opacity-100'><IoCloseCircleSharp /></button>
          </div>
        </motion.div>
      }

    </AnimatePresence>
  )
}

export default Alert