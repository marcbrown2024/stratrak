'use client'

import CreateLogTableRow from "@/components/CreateLogTableRow";
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const CreateLog = () => {
  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0, 1])
  const [shouldSubmit, setShouldSubmit] = useState<Boolean>(false)
  const [logs, setLogs] = useState<LogDetails[]>([])

  const addRow = () => {
    setTableRowsIds(rowArr => [...rowArr, rowArr.length])
  }

  const remRow = () => {
    setTableRowsIds(rowArr => {
      if (rowArr.length == 1) return rowArr
      return rowArr.slice(0, -1)
    })
  }
  
  const updateLogs = (log: LogDetails) => {
    setLogs([...logs, log])
  }

  const triggerSubmit = () => {
    setShouldSubmit(true)
  }

  useEffect(() => {
    console.log(logs);
  }, [shouldSubmit])

  return (
    <div className="flex flex-col space-y-4 w-[70%] h-fit min-h-[500px] mx-auto">
      <h1 className="text-4xl pl-6">Monitoring Log</h1>

      {/* Create log form wrapper */}
      <div className="flex flex-col mt-10">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr className="text-blue-500">
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium uppercase"
                    >
                     Monitor Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium uppercase"
                    >
                     Signature
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium uppercase"
                    >
                     Type of Visit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium uppercase"
                    >
                     Purpose of Visit	
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium uppercase"
                    >
                     Date of Visit	
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 duration-200">
                  {
                    tableRowsIds.map((i, k) => (
                      <tr key={k}><CreateLogTableRow rowId={i} shouldSubmit={shouldSubmit} updateLogs={updateLogs} /></tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* add or delete row */}
      <div className="flex space-x-2 pl-6">
        <button onClick={remRow} disabled={tableRowsIds.length <= 1}><FaMinusCircle className={`text-2xl text-slate-200 ${tableRowsIds.length > 1 && "hover:text-blue-500"}`} /></button>
        <button onClick={addRow}><FaPlusCircle className="text-2xl text-slate-200 hover:text-blue-500" /></button>
      </div>
      <div 
        onClick={triggerSubmit}
        className="pl-6 w-full flex items-center justify-center">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:opacity-90">{`Save Log${tableRowsIds.length > 1 ? 's' : ''}`}</button>
      </div>
    </div>
  );
};

export default CreateLog;
