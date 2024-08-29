'use client'

import CreateLogTableRow from "@/components/CreateLogTableRow";
import { createLog, getLogs, getTrial, getTrials } from "@/firebase";
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

type params = {
  params: {
    trialId: string
  }
}

const CreateLog = ({params}: params) => {
  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0])
  const [logs, setLogs] = useState<LogDetails[]>([])
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails)

  const trialId = params.trialId

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
    setLogs(prevState => [...prevState, log])
  }

  const triggerSubmit = () => {
    const submitBtns = document.getElementsByClassName('formSubmitBtn')
    for (let i=0; i<submitBtns.length; i++) {
      (submitBtns[i] as HTMLButtonElement).click()
    }
  }

  const resetLogs = () => {
    const forms = document.querySelectorAll('form')
    for (let i=0; i<forms.length; i++) {
      forms[i].reset()
    }
    setTableRowsIds([0])
  }

  useEffect(() => {
    for (let log of logs) {
      createLog(log, trialId)
    }
    resetLogs()
  }, [trialId, logs])

  useEffect(() => {
    getTrial(trialId).then(response => setTrial(response.data))
  }, [])

  return (
    <div className="flex flex-col space-y-4 w-[70%] h-fit min-h-[500px] mx-auto">
      <h1 className="text-4xl pl-6">Monitoring Log</h1>
      <br />
      <div className="px-6 py-2 bg-slate-50 w-fit rounded-lg flex space-x-6">
        <p>Investigator Name: <span className="font-bold">{trial?.investigatorName}</span></p>
        <p>Protocol: <span className="font-bold">{trial?.protocol}</span></p>
        <p>Site Visit: <span className="font-bold">{trial?.siteVisit}</span></p>
      </div>
      {/* Create log form wrapper */}
      <div className="w-full flex justify-end pr-6">
        <button 
        onClick={resetLogs}
        className="bg-red-500 text-white px-4 py-1 rounded-full disabled:opacity-30">Reset</button>
      </div>
      <div className="flex flex-col">
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
                      <tr key={k}><CreateLogTableRow rowId={i} updateLogs={updateLogs} /></tr>
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
