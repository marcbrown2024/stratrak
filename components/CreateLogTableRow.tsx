'use client'

import { useLogStore } from "@/store/CreateLogStore";
import React, { useEffect, useRef, useState } from "react";

type params = {
  rowId: number,
}

const TableRow = ({rowId}: params) => {
  const [logs, updateLog] = useLogStore(state => [state.logs, state.updateLog])


  useEffect(() => {
    console.log(logs)
  }, [logs])

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <form>
          <input type="text"
            defaultValue={logs[rowId]["monitorName"]}
            onChange={e => updateLog(rowId, "monitorName", e.target.value)}
            id={`name-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 pl-0"
            placeholder="Enter name..."
          />
          <button type="submit" className={"hidden formSubmitBtn"} />     
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
          aria-label="Date" type="date" />        
        </form>
      </td>
    </>
  );
};

export default TableRow;
