import React, { useEffect, useRef, useState } from "react";
import Trie from "../utils/autocomplete";
import CloseIcon from '@mui/icons-material/Close';
import { CheckBox, RequestQuote } from "@mui/icons-material";
import { useFinancialData } from "./FinancialDataProvider";
import { BeatLoader, PacmanLoader } from "react-spinners";
import { useAuth } from "../Auth/AuthProvider";

export default function FinancialData(props) {

  const {isLoading, data, setIsLoading, setData} = useFinancialData()
  const {token, setToken} = useAuth()

  const [sourcesOfIncome, setSourcesOfIncome] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [investmentCategoryPreference, setInvestmentCategoryPreference] = useState([]);
  const [riskTolerance, setRiskTolerance] = useState("");
  const [investmentHorizon, setInvestmentHorizon] = useState("");
  const [investmentManagementPreferences, setInvestmentManagementPreference ] = useState("");
  const [formError, setFormError] = useState("")
  const [dataNull, setDataNull] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const exampleSourcesOfIncome = ["Salary", "Rent", "Investments"]
  const exampleFinancialGoals = ["Retirement", "Educational Fund", "Starting a buisness"]
  const exampleInvestmentCategoryPreference = ["Tax-Efficiency", "Environmental, Social, and Governance (ESG)", "Common Stocks", "Government-Supported Development", "Sustainable Growth and Impact", "Technological Advancement and Innovation"]
  const exampleRiskTolerance = ["LOW", "MEDIUM", "HIGH"]
  const exampleInvestmentHorizon = ["Short Term", "Long Term"]
  const valueInvestmentHorizon = ["shortTerm", "longTerm"]
  const exampleInvestmentManagementPreference = ["ACTIVE", "PASSIVE"]

  useEffect(()=>{
    if(data != null){
      setSourcesOfIncome(data.sourcesOfIncome)
      setFinancialGoals(data.financialGoals)
      setInvestmentCategoryPreference(data.investmentCategoryPreference)
      setRiskTolerance(data.riskTolerance)
      setInvestmentHorizon(data.investmentHorizon)
      setInvestmentManagementPreference(data.investmentManagementPreference)
      setDataNull(false)
    } else {
      setDataNull(true)
    }
    console.log("Isloading changed finan", data)
  },[isLoading, data])

  const handleInvestmentCategoryOnChange = (e) =>{
    var checked = e.target.checked;
    var category = e.target.value;
    var preferredCategory = [...investmentCategoryPreference]
    console.log(checked)
    if(checked){
      preferredCategory.push(category)
    } else{
      preferredCategory.splice(preferredCategory.indexOf(category), 1);
    }
    setInvestmentCategoryPreference([...preferredCategory])
    console.log(preferredCategory)
  }

  const validateForm = () => {
    console.log(sourcesOfIncome.length)
    if(sourcesOfIncome.length == 0){
      setFormError("Enter at least one valid source of income");
    } else if(financialGoals.length == 0){
      setFormError("Enter at least one financial goal")
    } else if(investmentCategoryPreference.length == 0) {
      setFormError("Select at least one preferred ionvestment category")
    } else if(!riskTolerance) {
      setFormError("Select risk tolerance")
    } else if(!investmentHorizon) {
      setFormError("Select investment horizon")
    } else if(!investmentManagementPreferences) {
      setFormError("Select investment management preference")
    } else {
      setFormError("")
      return true
    }
    return false
  }

  const formRequestJson = () => {
    var requestData = {...data}
    if(requestData == null){
      requestData = {}
    }

    requestData.investmentCategoryPreference = investmentCategoryPreference
    requestData.riskTolerance = riskTolerance
    requestData.investmentManagementPreference = investmentManagementPreferences
    requestData.investmentHorizon = investmentHorizon
    requestData.sourcesOfIncome = sourcesOfIncome
    requestData.financialGoals = financialGoals

    return requestData
  }

  const handleFinancialDataSave = () => {
    if(!validateForm()){
      return
    }
    setLoading(true)
    var requestData = formRequestJson()
    console.log(requestData)
    fetch(process.env.REACT_APP_API_URL+"api/v1/newUserPreference",{
      method: "POST",
      headers: {
        "Authorization": "Bearer "+token,
        "content-type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
    .then(data=> data.json())
    .then(dataJson => {
      if(dataJson.success){
        setError("")
        setMessage("Preference saved successfully")
        setData(requestData)
      } else{
        setError(dataJson.error)
      }
      setLoading(false)
    })
    .catch((e) =>{
      setLoading(false)
      console.log(e)
    })
  }

  const handleFinancialDataUpdate = () => {
    if(!validateForm()){
      return
    }
    var requestData = formRequestJson()
    console.log(data,requestData)
    console.log(JSON.stringify(data) === JSON.stringify(requestData))
    if(JSON.stringify(data) === JSON.stringify(requestData)){
      setError("No update has been made")
      return
    }
    setError("")
    setLoading(true)
    fetch(process.env.REACT_APP_API_URL+"api/v1/editUserPreference",{
      method:"PUT",
      headers : {
        "Authorization": "Bearer "+token,
        "content-type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
    .then(data=> data.json())
    .then(dataJson => {
      if(dataJson.success){
        setError("")
        setMessage("Preference updated successfully")
        setData(requestData)
      } else{
        setError(dataJson.error)
      }
      setLoading(false)
    })
    .catch((e) =>{
      setLoading(false)
      console.log(e)
    })
  }




  return ( 
    <div className="w-full flex flex-col justify-start items-center px-4">
      <div className="w-full flex justify-center items-start flex-col mb-2 mt-10">
      <h2 className="text-lg font-semibold text-left">{dataNull? "Add your financial details" : "Your financial details"}</h2>
      <label className="text-red-600 text-sm">{formError}</label>
      <label className="text-red-600 text-sm">{error}</label>
      <label className="text-green-600 text-sm">{message}</label>
      </div>
      <div className="w-full flex flex-col justify-between items-start space-y-4">
        <div className="w-full flex justify-between items-center px-12">
          <div className="w-1/2">
            <Select setData={setRiskTolerance} selectedData={riskTolerance} options={exampleRiskTolerance} placeholderText={"Select Risk Tolerance"} type={"riskTolerance"}></Select>
          </div>
          <div className="w-1/2">
            <Select setData={setInvestmentHorizon} values={valueInvestmentHorizon} selectedData={investmentHorizon}  options={exampleInvestmentHorizon} placeholderText={"Select Investment Horizon"} type={"investmentHorizon"}></Select>
          </div>
        </div>
        <div className="w-full flex justify-between items-center px-12">
          <div className="w-1/2">
            <Select setData={setInvestmentManagementPreference} selectedData={investmentManagementPreferences} options={exampleInvestmentManagementPreference} placeholderText={"Select Investment Management Style"} type={"investmentManagementPreference"}></Select>
          </div>
          <div className="w-1/2 flex justify-start items-center">
            <MultipleSelect selectedData={sourcesOfIncome} setData={setSourcesOfIncome} data={exampleSourcesOfIncome} placeholderText={"Enter Sources of Income"}></MultipleSelect>
            <Description exampleData={exampleSourcesOfIncome}></Description>
          </div>
        </div>
        <div className="w-full flex px-12 justify-start items-center">
          <div className="w-1/2 flex justify-start items-center ">
            <MultipleSelect selectedData={financialGoals} setData={setFinancialGoals} data={exampleFinancialGoals} placeholderText={"Enter Financial Goals"} ></MultipleSelect>          
            <Description exampleData={exampleFinancialGoals}></Description>
          </div>
        </div>
        <div className="w-full px-12 ">
          <label className=" font-semibold">Choose Prefered Investment Category </label>
          <div className="w-full grid grid-cols-2">
            {exampleInvestmentCategoryPreference.map((option, index)=>{
              console.log(option+index+investmentCategoryPreference.includes(option))
              return (
              <div>
                <input type="checkbox" value={option} key={index} id={option} onChange={handleInvestmentCategoryOnChange} checked={investmentCategoryPreference.includes(option)} ></input>
                <label htmlFor={option} className="text-gray-950 ml-2">{option}</label>
              </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-start mt-6">
        {loading? <button className="w-1/6 text-gray-50 bg-gray-950 py-2 font-semibold flex justify-center items-center ">
          <BeatLoader color="#FFFFFF"></BeatLoader>
        </button> :
       dataNull? 
          <button className="w-1/6 text-gray-50 bg-gray-950 py-2 font-semibold " type="submit" onClick={handleFinancialDataSave}>Save Financial Details</button>
            :
          <button className="w-1/6 text-gray-50 bg-gray-950 py-2 font-semibold " type="submit" onClick={handleFinancialDataUpdate}>Update Financial Details</button>
        }
        </div>
    </div>
  )
}

function MultipleSelect(props) {
  const {data, selectedData, setData, placeholderText, chooseFromExample} = props;
  const autocomplete = new Trie()

  const ref = useRef(null)

  const [selectInput, setSelectInput] = useState("")
  const [suggestion, setSuggestion] = useState([...data])
  const [dropDown, setDropDown] = useState(false)

  useEffect(()=>{
    if(data?.length>0){
      data.forEach(i => {
        autocomplete.insert(i)
      })
    }
  },[])

  const handleChangeSelectInput = (e) => {
    var selected = e.target.value
    if(selected[selected.length-1]==","){
      setData([...selectedData, selected.substring(0,selected.length-1)])
      ref?.current?.scrollIntoView({
        behaviour: "smooth",
        block: "end"
      })
      setSelectInput("")
    } else{
      setSelectInput(selected)
    }
  }

  const handleDeleteSelectedOption = (index) => {
    var selectedInput = [...selectedData]
    selectedInput?.splice(index, 1)
    setData([...selectedInput])
  }

  return (
    <div className="w-1/2 py-0.5 px-1 max-h-10 min-h-10 text-gray-950 border border-gray-950 flex justify-start rounded-sm items-center space-x-1 overflow-x-auto focus:scroll-auto">
      {selectedData?.map((option, i) => {
        return (
          <div key={i} className="px-1 py-0.5 w-min flex h-full border justify-center items-center ">
            <div className="w-fit whitespace-nowrap">{option}</div>
            <button onClick={() => handleDeleteSelectedOption(i)}><CloseIcon fontSize="small" /></button>
          </div>
        )
      })}
      <input className="focus:outline-none min-w-full w-fit ml-2" type="text" onChange={handleChangeSelectInput} placeholder={placeholderText} value={selectInput}></input>
      <div ref={ref}></div>
    </div>
  )
}

function Select(props){
  const {options, placeholderText, type, setData, selectedData, values} = props
  console.log(options)

  const handleDataSelect = (e) => {
    setData(e.target.value)
  }
  return(
    <div className=" w-1/2">
      <select onChange={handleDataSelect} type="text" id={type} value={selectedData} required className="w-full h-10 border border-gray-950 rounded-s px-2 invalid:text-gray-400">
        <option value={""} className="text-gray-400" disabled selected>{placeholderText}</option>
        {options?.map((option, index)=>{
          return <option value={values? values[index] : option} key={index}>{option}</option>
        })}        
      </select>
    </div>
  )
}

function Description(props){
  const {exampleData} = props;
  var example = "*Enter comma separated values. For example, " + exampleData.map((data)=>{return " "+data });
  return (
    <div className="w-1/2 px-2 line-clamp-2 text-sm text-gray-600">
      {example}
    </div>
  )
}