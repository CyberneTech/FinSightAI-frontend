import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPaswordError, setConfirmPasswordError] = useState("");

  const handleNameChange = (e) => {
    var name = e.target.value
    setName(name)
    if(name.length < 2){
      setNameError("Name must be of more than 2 character")
    } else {
      setNameError("")
    }
  }

  const handleEmailChange = (e) => {
    var error = ""
    var email = e.target.value
    setEmail(email);
    if (!email) {
      error = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      error = 'Invalid email address'
    }

    setEmailError(error)
  }

  const handlePasswordChange = (e) => {
    var error = ""
    var pass = e.target.value
    setPassword(pass)
    if(confirmPasword == pass){
      setConfirmPasswordError("")
    } else {
      setConfirmPasswordError("Does not match with password")
    }
    if(!pass) {
      error="Required"
    } else if(pass.length < 8) {
      error = "Password must be of atleast 8 character"
    } else if(!(/^(?=.*[0-9])/.test(pass))){
      error = "Password must have one number"
    }

    setPasswordError(error)
  }

  const handleConfirmPasswordChange = (e) => {
    var conPassword = e.target.value
    setConfirmPassword(conPassword)
    if(conPassword != password){
      setConfirmPasswordError("Does not match with password")
    } else {
      setConfirmPasswordError("")
    }
  }

  const validate = () => {
    return emailError || nameError || passwordError || confirmPaswordError || !name || !email || !password || !confirmPasword
  }

  const handleSignup = () => {
    if(validate()){
      return
    }

    const data = {
      name,
      email,
      password
    }

    fetch(process.env.REACT_APP_API_URL+"signin",{
      method: "POST",
      headers:{
        "content-type":"application/json"
      },
      body: JSON.stringify(data)
    })
    .then(data => data.json())
    .then(dataJson => {
      if(dataJson?.success){
        setError("")
        setMessage("Successfully Signedup")
      } else {
        setError(dataJson?.error)
      }
    })
    .catch(e => {
      setError(e)
    })

  }

  return (
    <div className=" bg-gray-50 flex flex-col justify-center items-center space-y-3 h-screen w-screen relative">
      <div className="text-gray-950 font-bold text-3xl text- absolute top-4 left-6">FinSightAI</div>
      <div className="flex justify-start items-center flex-col w-1/3 space-y-3 bg-transparent ">
        <div className="text-black font-semibold text-3xl px-6 py-4">
          Signup
        </div>
        <label className="text-red-600 text-sm">{error}</label>
        <label className="text-green-600 text-sm">{message}</label>
        <div className="input-auth-wrapper">
          <input className="input-auth" placeholder="Name" type="text" onChange={handleNameChange}></input>
          <label className={`label-error ${nameError != ""? "":"hidden"}`}>{nameError}</label>
        </div>
        <div className="input-auth-wrapper">
          <input className="input-auth" placeholder="Email" type="email" onChange={handleEmailChange}></input>
          <label className={`label-error ${emailError != ""? "":"hidden"}`}>{emailError}</label>
        </div>
        <div className="input-auth-wrapper">
          <input className="input-auth" placeholder="Password" type="password" onChange={handlePasswordChange}></input>
          <label className={`label-error ${passwordError != ""? "":"hidden"}`}>{passwordError}</label>
        </div>
        <div className="input-auth-wrapper">
          <input className="input-auth" placeholder="Confirm Password" type="password" onChange={handleConfirmPasswordChange}></input>
          <label className={`label-error ${confirmPaswordError != ""? "":"hidden"}`}>{confirmPaswordError}</label>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-gray-950 mt-2 ">
          <button className={`button-auth ${validate() ? "hover:cursor-not-allowed": ""}`} onClick={handleSignup} >Submit</button>
        </div>
        <div className="w-1/2 flex justify-center items-center mt-2">
          Existing user? <Link to={"/auth/login"} className=" underline ml-2 underline-offset-1">Login</Link>
        </div>
      </div>
    </div>
  );
}