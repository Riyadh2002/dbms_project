import React from 'react'
import logo from './images/logo.png'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Current from './Current';
import Accepted from './Accepted';
import Rejected from './Rejected';
import { useContext,useEffect } from "react";
import { UserContext } from "./Usercontext";

export default function Employee() {
  const navigate=useNavigate()
  const [activePage, setActivePage] = useState('current');
  const [name, setName]=useState("")
  const [id, setId]=useState("")
  const [deptname,setdeptname]=useState("")
  const { userEmail } = useContext(UserContext);
  console.log("email from employee",userEmail)
  const renderContent = () => {
    if (activePage === 'current') return <Current />;
    if (activePage === 'accepted') return <Accepted/>
    if (activePage === 'rejected') return <Rejected/>
  }

  const getPageTitle = () => {
    if (activePage === 'current') return <> <h3 
    style={{ 
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: "550", 
      color: "#00BCD4", 
      fontSize: "24px" 
    }}
  >
    Current Requests
  </h3></>;
    if (activePage === 'accepted') return "Accepted Requests";
    if (activePage === 'rejected') return "Rejected Requests";
  };

  const [email, setEmail] = useState("");
          
            useEffect(() => {
              const em = localStorage.getItem("email");
              setEmail(em);  
              console.log(em);  
            }, []);

  fetch('http://localhost:3000/empName', {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      email: email
    })
  })
  .then(res => res.json())
  .then(data => {
    setName(data.name)
    setId(data.id);
    setdeptname(data.dept_name)
    localStorage.setItem("empName", data.name); // browser storage
  })
  .catch(error => {
    console.error("Error fetching employee name:", error);
  });
  
  const handlePublishNewRequest = () => {
    navigate("/newrequest")
  };
  
  
  return (
    <>
    <div style={{ backgroundColor: "#f7f9fb", minHeight: "100vh" }}>
  
  {/* Top Header (Fixed) */}
  <div 
    className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm" 
    style={{ 
      backgroundColor: "#ffffff", 
      borderBottom: "1px solid #e0e0e0",
      position: "sticky",
      top: 0,
      zIndex: 1020
    }}
  >
    {/* Left Section: Logo + Employee Info */}
    <div className="d-flex align-items-center gap-3">
      <img 
        src={logo}
        alt="Logo" 
        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
      />
      <div>
        <h4 style={{ fontWeight: "600", color: "#00BCD4", marginBottom: "4px" }}>
        {name}
        </h4>
        <p style={{ margin: "0", fontSize: "14px", color: "#7b8a8b" }}>
          Department: {deptname}
        </p>
      </div>
    </div>

    {/* Right Section: Employee ID */}
    <div>
      <span 
        className="badge rounded-pill" 
        style={{ 
          backgroundColor: "#00BCD4", 
          color: "#ffffff", 
          fontSize: "14px", 
          padding: "8px 20px" 
        }}
      >
        ID : {id}
      </span>
    </div>
  </div>

  {/* Top Navbar (Fixed below header) */}
  <nav 
  className="navbar shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
  style={{ 
    backgroundColor: "#ffffff", 
    borderBottom: "2px solid #00BCD4",
    position: "sticky",
    top: "72px",
    zIndex: 1010,
    fontFamily: "'Lato', sans-serif"
  }}
>
  {/* Left Section: Toggle + Title */}
  <div className="d-flex align-items-center">
    <button
      className="btn border-0 me-3"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebar"
      aria-controls="sidebar"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <h4 className="my-auto" style={{ color: "#00BCD4", fontWeight: "bold", fontSize: "20px" }}>
      {getPageTitle()}
    </h4>
  </div>

  {/* Right Section: Publish Button (only for current) */}
  {activePage === 'current' && (
    <button
      className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
      onClick={handlePublishNewRequest}
      style={{
        fontSize: "14px",
        fontWeight: "500",
        color: "#fff",
        backgroundColor: "#00BCD4",
        border: "none",
        transition: "background 0.3s ease"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#019bab")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00BCD4")}
    >
      <i className="bi bi-plus-circle"></i> Publish New
    </button>
  )}
</nav>

  

  {/* Sidebar */}
  <div
    className="offcanvas offcanvas-start"
    tabIndex="-1"
    id="sidebar"
    aria-labelledby="sidebarLabel"
    style={{ width: "260px", backgroundColor: "#ffffff" }}
  >
    
    <div className="offcanvas-header border-bottom" style={{ backgroundColor: "#00BCD4" }}>
      <h5 className="offcanvas-title text-white" id="sidebarLabel">
        Menu
      </h5>
      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    

    <div className="offcanvas-body px-2">
      <ul className="list-group list-group-flush">
        <li
          className={`list-group-item mb-2 rounded ${activePage === 'current' ? 'bg-info text-white' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePage('current')}
          data-bs-dismiss="offcanvas"
        >
          Current Requests
        </li>
        <li
          className={`list-group-item mb-2 rounded ${activePage === 'accepted' ? 'bg-info text-white' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePage('accepted')}
          data-bs-dismiss="offcanvas"
        >
          Accepted Requests
        </li>
        <li
          className={`list-group-item mb-2 rounded ${activePage === 'rejected' ? 'bg-info text-white' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePage('rejected')}
          data-bs-dismiss="offcanvas"
        >
          Rejected Requests
        </li>
      </ul>
    </div>
  </div>

  {/* Main Scrollable Content */}
  <div
    className="p-4"
    style={{
      height: "calc(100vh - 144px)",
      overflowY: "auto"
    }}
  >
    {renderContent()}
  </div>

</div>



    </>
  )
}
