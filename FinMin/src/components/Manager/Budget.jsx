import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../Employee/Usercontext";
import { PieChart, Pie, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import logo from "../Employee/images/logo.png";
import { data } from 'react-router';

export default function Budget( ) {
  const [used, setUsed] = useState(0); // default value 0
  const [totslbudget, settotalbudget]=useState(0)
  const [managerid,setmanagerid]=useState("")
  const { userEmail } = useContext(UserContext);

  const [email, setEmail] = useState("");
      
        useEffect(() => {
          const em = localStorage.getItem("email");
          setEmail(em);  
          console.log(em);  
        }, []);

        // fetch("http://localhost:3000/managerid", {
        //     method:"POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //       },
        //       body: JSON.stringify({ email: email })
        //     })
        //       .then(res => res.json())
        //       .then(data => {
        //         console.log("manager data", data);
        //         // setmanagerid(data.manager.manager_id);  // এখানে ঠিকভাবে ID নিচ্ছো তো?
        //         // console.log("manager id:", data.manager.manager_id);  // এখানে log দাও
        //       });
    
        //       console.log("manager id:", managerid)

  useEffect(() => {
    if (!email) return; // userEmail না থাকলে fetch করব না
    console.log("Budget email:", email)


    fetch("http://localhost:3000/budgetHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.used_budget !== undefined && data.total_budget !== undefined) {
          const usedValue = Number(data.used_budget);
          const total = Number(data.total_budget);
      
          console.log("Used:", usedValue);
          console.log("Total:", total);
      
          setUsed(usedValue);
          settotalbudget(total);
        } else {
          console.error("Invalid data format received:", data);
        }
      })
  }, [email]);

  const totalBudget = totslbudget;
  const remaining = totalBudget - used;

  const pieData = [
    { name: 'Used', value: used },
    { name: 'Remaining', value: remaining }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF4081'];


  const barData = [
    { name: 'Total', amount: totalBudget },
    { name: 'Used', amount: used },
    { name: 'Remaining', amount: remaining }
  ];

  return (
    <div className="d-flex" style={{ display: 'flex', height: '100vh', fontFamily: 'Lato, sans-serif' }}>
      
      <div className="d-flex" style={{ fontFamily: "'Lato', sans-serif" }}>
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
        style={{ 
          width: "60px", 
          height: "60px", 
          borderRadius: "50%", 
          objectFit: "cover" 
        }}
      />
      <h4 style={{ marginTop: "10px", color: "#333", fontSize: "18px", fontWeight: "600" }}>{name}</h4>
      <p style={{ fontSize: "13px", color: "#666" }}>Manager ID: </p>
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
          <a 
            href="/budget" 
            style={{ 
              color: "#333", 
              textDecoration: "none", 
              fontWeight: "500", 
              fontSize: "15px" 
            }}
          >
            🏠 Overview
          </a>
        </li>
        <li>
          <a 
            href="/createBudget" 
            style={{ 
              color: "#333", 
              textDecoration: "none", 
              fontWeight: "500", 
              fontSize: "15px" 
            }}
          >
            ➕ Create Budget
          </a>
        </li>
      </ul>
    </div>
  </div>

 
</div>


<main 
  className="flex-1 p-10" 
  style={{ 
    flex: 1, 
    backgroundColor:"white",
    fontFamily: "'Lato', sans-serif" 
  }}
>
  {/* Page Header */}
  <div 
    style={{ 
        marginTop:"40px",
      marginBottom: "60px", 
      textAlign: "center" 
    }}
  >
    <h3 
      style={{ 
        fontSize: "28px", 
        fontWeight: "600", 
        color: "rgba(0,0,0,0.7)", 
        letterSpacing: "1px" 
      }}
    >
      Finance Department
    </h3>
  </div>

  {/* Chart Section */}
  <div 
    style={{ 
      
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '40px', 
      maxWidth: '1000px', 
      margin: '0 auto' 
    }}
  >
    <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <defs>
      {pieData.map((_, index) => (
        <linearGradient id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1" key={index}>
        <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.9} />  {/* light red */}
        <stop offset="50%" stopColor="#FF3D3D" stopOpacity={0.7} /> {/* vivid red */}
        <stop offset="100%" stopColor="#B71C1C" stopOpacity={0.6} /> {/* dark red */}
      </linearGradient>
      
      
      ))}
    </defs>
    <Pie
      data={pieData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={`url(#pieGradient${index})`} />
      ))}
    </Pie>
    <Tooltip />
    <Legend verticalAlign="bottom" height={36} />
  </PieChart>
</ResponsiveContainer>


    <ResponsiveContainer width="100%" height={300}>
  <BarChart data={barData}>
    <defs>
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0dcaf0" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#0dcaf0" stopOpacity={0.3} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar
      dataKey="amount"
      fill="url(#barGradient)"
      barSize={40}
      radius={[10, 10, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>

  </div>
</main>

    </div>
  );
}
