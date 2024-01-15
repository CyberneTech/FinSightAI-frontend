import React, { useCallback, useRef } from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";

const FinanancialDataContext = createContext();

const FinancialDataProvider = ({ children }) => {
  // State to hold the authentication token
  const [data, setData_] = useState(null);
  const {token} = useAuth()
  const [isLoading, setIsLoading_] = useState(true)
  const count = useRef(0)

  // Function to set the authentication token
  const setData = (data) => {
    setData_(data);
  };

  const setIsLoading = (value) => {
    setIsLoading_(value)
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+"api/v1/getUserPreference", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "content-type": "application/json"
      }
    })
    .then(data => data.json())
    .then(dataJson => {
      console.log("Setting isloading to true")
      if(dataJson.userId){
        setData_(dataJson)
      }
      if(dataJson.error){
        setData_(null)
      }
      setIsLoading_(false)
    })
    .catch((e) => {
      console.log("error",e)
      setIsLoading_(false)
    })
  }, []);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      isLoading,
      data,
      setIsLoading,
      setData,
    }),
    [data, isLoading]
  );

  // Provide the authentication context to the children components
  return (
    <FinanancialDataContext.Provider value={contextValue}>{children}</FinanancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  return useContext(FinanancialDataContext);
};

export default FinancialDataProvider;