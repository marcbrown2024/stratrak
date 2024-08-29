'use client'

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type params = {
  rowId: number,
  updateLogs: (log: LogDetails) => void
}

type Inputs = LogDetails

const TableRow = ({rowId, updateLogs}: params) => {

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const logDetails: LogDetails = {
    monitorName: "",
    signature: "",
    typeOfVisit: "Remote",
    purposeOfVisit: "SIV",
    dateOfVisit: getCurrentDate(),
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({defaultValues: logDetails});


  const onSubmit: SubmitHandler<Inputs> = (data, e) => {
    e?.preventDefault()
    updateLogs({
      ...logDetails,
      ...data,
    })
  }

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("monitorName")} type="text"
            id={`name-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0"
            placeholder="Enter name..."
          />
          <button type="submit" className={"hidden formSubmitBtn"} />     
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input {...register("signature")} type="text"
            id={`signature-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0"
            placeholder="Your signature here"
          />   
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <select 
          {...register("typeOfVisit")}            
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
          {...register("purposeOfVisit")}            
          id={`purpose-${rowId}`}
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
          <input 
          {...register("dateOfVisit")}
          aria-label="Date" type="date" />        
        </form>
      </td>
    </>
  );
};

export default TableRow;
