'use client'

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";

// firebase components/functions
import { createLog, getTrial } from "@/firebase";

// custom components
import CreateLogTableRow from "@/components/CreateLogTableRow";

// icons
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useLogStore } from "@/store/CreateLogStore";
import { defaultLog } from "@/lib/defaults";
import { useAlertStore } from "@/store/AlertStore";
import { AlertType } from "@/enums";
import Loader from "@/components/Loader";

type params = {
  params: {
    trialId: string
  }
}

const CreateLog = ({params}: params) => {
  const [logs, removeLog, updateLogs, clearLogs] = useLogStore(state => [state.logs, state.removeLog, state.updateLogs, state.clearLogs])

  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0])
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails)

  const trialId = params.trialId
  const createLogTableRef = useRef<HTMLTableElement>(null)
  const [setAlert] = useAlertStore(state => [state.setAlert])

  const [loading, setLoading] = useState<Boolean>(true)

  const addRow = () => {
    updateLogs(tableRowsIds.length, defaultLog)
    setTableRowsIds(rowArr => [...rowArr, rowArr.length])
  }

  const remRow = () => {
    if (tableRowsIds.length == 1) return

    removeLog(tableRowsIds.length-1)

    setTableRowsIds(rowArr => {
      if (rowArr.length == 1) return rowArr
      return rowArr.slice(0, -1)
    })
  }

  const saveLogs = () => {
    
    for (let log in logs) {
      createLog(logs[log], trialId).then(response => {
        let alert: AlertBody
        let alertType: AlertType

        if (response.success) {
          alert = {
            title:"Success!",
            content: "Log" + (Object.keys(logs).length > 1 ? "s were" : " was") + "  saved successfully."
          }
          alertType = AlertType.Success
        } else {
          alert = {
            title:"Something went wrong",
            content: "Could not save logs, please try again"
          }
          alertType = AlertType.Error

        }
        setAlert(alert, alertType)
        resetLogs()
      })
    }
  }

  const resetLogs = () => {
    clearLogs()
    createLogTableRef.current?.querySelectorAll('form').forEach(form => form.reset())
    setTableRowsIds([0])
  }

  useEffect(() => {
    getTrial(trialId).then(response => {
      setTrial(response.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="h-full flex flex-col w-[70%] mx-auto justify-start gap-5 px-20">
      <h1 className="text-3xl text-blue-500 font-bold w-full text-center">Monitoring Log</h1>
      <div className="px-8 py-2 bg-white mt-10 w-fit rounded-lg flex space-x-4 border">
        <div className="font-bold text-gray-500">
          <p>Investigator Name:</p>
          <p>Protocol:</p>
          <p>Site Visit:</p>
        </div>
        {
          loading ?
          <Loader /> 
          :
          <div className="flex flex-col">
            <p className="">{trial?.investigatorName}</p>
            <p className="">{trial?.protocol}</p>
            <p className="">{trial?.siteVisit}</p>
          </div>
        }
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
              <table ref={createLogTableRef} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr className="text-blue-500">
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                     Monitor Name
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                     Signature
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                     Type of Visit
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                     Purpose of Visit	
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                     Date of Visit	
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 duration-200">
                  {
                    tableRowsIds.map((i, k) => (
                      <tr key={k}><CreateLogTableRow rowId={i} /></tr>
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
      <div className="pl-6 w-full flex items-center justify-center">
        <button 
        onClick={saveLogs}
        className="px-4 py-2 w-fit bg-blue-500 text-white rounded-full hover:opacity-90">{`Save Log${tableRowsIds.length > 1 ? 's' : ''}`}</button>
      </div>
    </div>
  );
};

export default CreateLog;
