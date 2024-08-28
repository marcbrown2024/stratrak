'use client'

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type params = {
  rowId: number,
  shouldSubmit: Boolean,
  updateLogs: (log: LogDetails) => void
}

type Inputs = {
  monitorName: string,
}

const TableRow = ({rowId, shouldSubmit, updateLogs}: params) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const logDetails: LogDetails = {
    "monitorName": "",
    "signature": "",
    typeOfVisit: "Remote",
    purposeOfVisit: "SIV",
    dateOfVisit: "",
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateLogs({
      ...logDetails,
      ...data,
    })
  }

  useEffect(() => {
    if (shouldSubmit) {
      const forms = document.querySelectorAll('form')
      for (let i=0; i<forms.length; ) {
        forms[i].submit()
      }
    }
  }, [shouldSubmit])

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("monitorName")} type="text"
            id={`name-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0"
            placeholder="Enter name..."
          />          
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input type="text"
            id={`signature-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0"
            placeholder="Your signature here"
          />          
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <select             
          id={`visit-${rowId}`}
          className="hover:cursor-pointer text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0">
            <option>Remote</option>
            <option>Onsite</option>
            <option>Waiver Call</option>
          </select>          
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <select 
          id={`name-${rowId}`}
          className="hover:cursor-pointer text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0">
            <option>SIV</option>
            <option>IMV</option>
            <option>COV</option>
            <option>Audit</option>
          </select>          
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input aria-label="Date" type="date" />        
        </form>
      </td>
    </>
  );
};

export default TableRow;
