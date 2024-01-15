import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Login() {


  const navigate = useNavigate();
  const {token, setToken} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    if(!pass) {
      error="Required"
    }

    setPasswordError(error)
  }

  const handleLogin = () => {
    if(emailError || passwordError || !email || !password){
      return
    }

    fetch(process.env.REACT_APP_API_URL + "login",{
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(data => data.json())
    .then((data)=>{
      console.log(data)
      if(data?.token){
        setError("")
      setToken(data.token)
      localStorage.setItem("name", data.name)
      navigate("/");
      } else {
        setError(data?.error)
      }
    })
    .catch(e => setError(e))

  }

  return (
    <div className=" bg-gray-50 flex flex-col justify-center items-center space-y-3 h-screen w-screen relative">
      <div className="text-gray-950 font-bold text-3xl text- absolute top-4 left-6">FinSightAI</div>
      <div className="flex justify-start items-center flex-col w-1/3 space-y-2 bg-transparent ">
        <div className="text-black font-semibold text-3xl px-6 py-4">
          Login
        </div>
        <label className="text-red-600 text-sm">{error}</label>
        <input className="input-auth" placeholder="Email" type="email" onChange={handleEmailChange} value={email}></input>
        <label className={`label-error ${emailError != ""? "":"hidden"}`}>{emailError}</label>
        <input className="input-auth" placeholder="Password" type="password" onChange={handlePasswordChange} value={password}></input>
        <label className={`label-error ${passwordError != ""? "":"hidden"}`}>{passwordError}</label>
        <div className="w-1/2 flex justify-center items-center bg-gray-950 mt-1 ">
          <button className={`button-auth ${emailError || passwordError || !email || !password ? "hover:cursor-not-allowed": ""}`} onClick={handleLogin}>Submit</button>
        </div>
        <div className="w-1/2 flex justify-end items-center text-sm">
          Forgot Password?
        </div>
        <div className="w-1/2 flex justify-center items-center mt-2">
          New user? <Link to={"/auth/signup"} className=" underline ml-2 underline-offset-1">Signup</Link>
        </div>
      </div>
    </div>
  );
}