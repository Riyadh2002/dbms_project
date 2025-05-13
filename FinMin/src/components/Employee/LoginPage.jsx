import React, { useState } from 'react';
import logo from "./images/logo.png";
import { useNavigate } from "react-router";
import { UserContext } from "./Usercontext";
import { useContext } from "react";

export default function LoginPage() {

  let navigate = useNavigate();
  const { setUserEmail } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    console.log("Email from login:", email);
    console.log("Password:", password);

    fetch('http://localhost:3000/login', {
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body: JSON.stringify({
        email:email,
        password:password
      })
    })
    .then(res=>res.json())
    .then((data)=>{
      if(data.message=="employee"){
        localStorage.setItem("email", email);
        setUserEmail(email);
        navigate("/employee")
      }
      if(data.message=="manager"){
        localStorage.setItem("email", email);
        setUserEmail(email);
        navigate("/manager")
      }
    })

  };

  return (
    <>
      <div 
        className="d-flex justify-content-center align-items-center min-vh-100 bg-light" 
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >

        <div className="p-5 bg-white rounded-4 shadow-sm" style={{ width: "360px" }}>

          <div className="text-center mb-4">
            <img 
              src={logo}
              alt="Logo" 
              style={{ width: "70px", animation: "fadeIn 1.5s" }}
            />
          </div>

          {/* Title */}
          <h3 className="text-center mb-4 fw-semibold" style={{ color: "#00BCD4" }}>Welcome Back</h3>


          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange} 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange} 
              />
            </div>

            <button 
              type="submit" 
              className="btn w-100 text-white"
              style={{
                backgroundColor: "#00BCD4",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "10px",
                border: "none"
              }}
            >
              Login
            </button>
          </form>


          <p className="text-center mt-4" style={{ fontSize: "14px" }}>
            Don't have an account?{" "}
            <a href="#" className="fw-bold" style={{ color: "#00BCD4" }}>
              Sign up
            </a>
          </p>

        </div>

        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(-10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

      </div>
    </>
  );
}
