import React, { useState,useEffect } from 'react';
import logo from '../Employee/images/logo.png'; // আপডেট করতে হবে, যদি লোগো ভিন্ন হয়।
import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../Employee/Usercontext';

export default function Manager({  }) {
  const [managerid,setmanagerid]=useState("")
    const { userEmail } = useContext(UserContext);
    const [name,setname]=useState("")
    const [num, setNum]=useState("")
    const [acceptnum, setacceptnum]=useState("")

    const [email, setEmail] = useState("");
    
      useEffect(() => {
        const em = localStorage.getItem("email");
        setEmail(em);  
        console.log(em);  
      }, []);

    fetch("http://localhost:3000/approvedtask", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
      .then(res => res.json())
      .then(data => {
        setacceptnum(data.length);
  
      })
      .catch(err => {
        console.log(err);
      });
    

      fetch("http://localhost:3000/managerid", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email })
        })
          .then(res => res.json())
          .then(data=>{
            setmanagerid(data.id)
            console.log("manager id:", data.id)
            console.log("manager name:", data.name)
            setname(data.name)
          })

  fetch("http://localhost:3000/pendingRequest", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
    .then(res => res.json())
    .then(data => {
      setNum(data.length);

    })
    .catch(err => {
      console.log(err);
    });
  return (
    <>
    <div className="d-flex" style={{ display: 'flex', height: '100vh', fontFamily: 'Lato, sans-serif' }}>
  {/* Sidebar */}
  <div
    style={{
      width: "240px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #ddd",
      padding: "20px"
    }}
  >
    {/* Manager Info */}
    <div className="text-center mb-4">
      <img 
        src={logo}
        alt="Logo"
        style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
      />
      <h4 style={{ marginTop: "10px", color: "#333", fontSize: "18px", fontWeight: "600" }}>{name}</h4>
      <p style={{ fontSize: "13px", color: "#666" }}>Manager ID: {managerid}</p>
    </div>

    {/* Navigation */}
    <div style={{ marginTop: "30px" }}>
      <h6 style={{
        color: "#999", 
        fontSize: '12px', 
        letterSpacing: '1px', 
        textTransform: 'uppercase', 
        marginBottom: '15px'
      }}>
        Navigation
      </h6>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li className="mb-3">
          <Link to="/manager" className="text-decoration-none" style={{ color: "#333", fontWeight: "500", fontSize: "15px" }}>
            🏠 Overview
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/manager/requests" className="text-decoration-none" style={{ color: "#333", fontWeight: "500", fontSize: "15px" }}>
            📄 Requests
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/manager/reports" className="text-decoration-none" style={{ color: "#333", fontWeight: "500", fontSize: "15px" }}>
            📊 Reports
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/budget" className="text-decoration-none" style={{ color: "#333", fontWeight: "500", fontSize: "15px" }}>
            💰 Budget
          </Link>
        </li>
      </ul>
    </div>
  </div>

  {/* Main Content */}
  <main className="flex-1 p-4" style={{ backgroundColor: "#f4f6f8", width: "100%", minHeight: "100vh" }}>
  {/* Page Header */}
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h3 style={{ fontWeight: "700", color: "#2c3e50" }}>Welcome, {name}!</h3>
    <span className="badge rounded-pill shadow-sm" style={{
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      fontSize: "16px",
      padding: "10px 20px",
      color: "#fff",
    }}>
      Dashboard
    </span>
  </div>

  {/* Overview Boxes */}
  <div className="dashboard-overview">
    <h4 className="mb-3" style={{ color: "#2c3e50", fontWeight: "600" }}>Overview</h4>
    <div className="d-flex justify-content-between flex-wrap gap-4">
      
      {/* Pending Requests - Gradient */}
      <Link to="/pendingreq" className="text-decoration-none" style={{ flex: "1 1 30%" }}>
        <div className="p-4 rounded-4 text-white shadow-sm card-hover" style={{
          background: "linear-gradient(135deg, #FF7E5F, #FEB47B)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}>
          <h5 className="mb-1" style={{ fontWeight: "600" }}>Pending Requests</h5>
          <p className="m-0">{num} Requests</p>
        </div>
      </Link>

      {/* Approved Tasks - Solid color */}
      <Link to="/acceptedTask" className="text-decoration-none" style={{ flex: "1 1 30%" }}>
        <div className="p-4 rounded-4 text-white shadow-sm card-hover" style={{
          backgroundColor: "#27ae60",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}>
          <h5 className="mb-1" style={{ fontWeight: "600" }}>Approved Tasks</h5>
          <p className="m-0">{acceptnum} Tasks</p>
        </div>
      </Link>

      {/* Rejected Requests - Gradient */}
      <div className="p-4 rounded-4 text-white shadow-sm card-hover" style={{
        background: "linear-gradient(135deg, #FF512F, #DD2476)",
        flex: "1 1 30%",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}>
        <h5 className="mb-1" style={{ fontWeight: "600" }}>Rejected Requests</h5>
        <p className="m-0">2 Requests</p>
      </div>
    </div>
  </div>

  {/* Optional Custom CSS */}
  <style>
    {`
      .card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        cursor: pointer;
      }
    `}
  </style>
</main>



</div>


    </>
  );
}
