import React, { useEffect, useState } from "react";
import { useFinancialData } from "./FinancialDataProvider";
import { useAuth } from "../Auth/AuthProvider";
import { PacmanLoader } from "react-spinners";

export default function InvestmentInsight(props) {

  const {isLoading, data, setIsLoading, setData} = useFinancialData()
  const {token, setToken} = useAuth();

  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState("")
  const [error, setError] = useState("")

  const handleGetInsights = () =>{
    setLoading(true)
    fetch(process.env.REACT_APP_LLM_API_URL+"api/v1/getInsights",{
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer "+token,
      }
    })
    .then(data => data.json())
    .then(dataJson => {
      if(dataJson.insight){
        setError("")
        setInsights(dataJson.insight)
      } else{
        setError(dataJson.error)
      }
      setLoading(false)
    })
    .catch(e => {
      setLoading(false)
      setError(e)
      console.log(e)
    })
  }

  useEffect(()=>{
    console.log("loading changed to", isLoading)
  },[isLoading])

  return (
    <>
    {loading?  <div className="mt-2 px-4 w-full flex justify-center items-center h-1/3 min-h-32">
      <PacmanLoader></PacmanLoader>
    </div>:
    insights? 
    <div className="w-full whitespace-pre-line px-4 mt-4 text-justify overflow-y-auto">
      <div className="text-lg font-semibold text-gray-950">Investment Insights</div>
      <p>{insights}</p>
      <button className="w-1/6 py-2 bg-gray-950 text-gray-50 mt-4 mb-2" onClick={handleGetInsights}>Get Investment Insights </button>
      <label className="text-red-600 text-sm mb-4">{error}</label>
    </div>:
    <div className="mt-2 px-4 w-full flex flex-col space-y-1 justify-center items-center h-1/3 min-h-32">
      {data == null? 
        <div className="w-1/6 py-2 border border-gray-950 flex justify-center items-center text-gray-950">Enter Financial Data to get Insights</div>:
        <button className="w-1/6 py-2 bg-gray-950 text-gray-50" onClick={handleGetInsights}>Get Investment Insights </button>
      }
      <label className="text-red-600 text-sm">{error}</label>
    </div>
}
    </>
  )
}