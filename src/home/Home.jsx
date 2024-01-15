import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import FinancialData from "./FinanancialData";
import { redirect, useNavigate } from "react-router-dom";
import InvestmentInsight from "./InvestmentInsight";
import { PacmanLoader } from "react-spinners";
import FinancialDataProvider, { useFinancialData } from "./FinancialDataProvider";

export default function Home(){

  const navigate = useNavigate();
  const {token, setToken} = useAuth();
  const [financialData, setFinancialData] = useState();
  const {data, setData, isLoading} = useFinancialData();
  const username = localStorage.getItem("name")
  
  useEffect(()=>{

  },[])

  const logout = () => {
    setToken("")
    localStorage.removeItem("token")
    navigate("/auth/login")
  }

  useEffect(() => {
    setFinancialData(null)
  },[isLoading])

  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center">
      <div className="w-full py-2 px-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">{"Hi, "+username}</h2>
        <button className="border border-gray-950 rounded py-1 px-2" onClick={logout}>Logout</button>
      </div>
      <div className="px-4 w-full">
          {isLoading? <div className="w-full flex justify-center items-center h-screen ">
      <PacmanLoader></PacmanLoader>
    </div> : <>
          <FinancialData></FinancialData>
          <InvestmentInsight></InvestmentInsight>
          </>}
      </div>
    </div>
  )
}