import React from 'react'
import { useLocation } from 'react-router'
export default function Details() {
    const location=useLocation()
    const data=location.state?.data
    console.log(data)
    console.log(data.img_url);

    

  return (
    <div 
  className="card p-4 shadow rounded-4 mx-auto mt-5"
  style={{ 
    maxWidth: "550px", 
    backgroundColor: "#ffffff", 
    borderLeft: "6px solid #00BCD4", 
    fontFamily: "'Lato', sans-serif",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)"
  }}
>
  {/* Title as Badge */}
  <div className="mb-4">
    <span 
      className="px-4 py-2 rounded-pill"
      style={{
        backgroundColor: "#00BCD4",
        color: "white",
        fontWeight: "600",
        fontSize: "16px",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
      {data.title}
    </span>
  </div>

  {/* Image Proof */}
  <div className="mb-4">
    <img 
      src={data.image_url} 
      alt="Buying Proof" 
      style={{ 
        width: "100%", 
        height: "auto", 
        borderRadius: "12px", 
        border: "1px solid #ddd",
        objectFit: "cover",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
      }}
    />
    <p style={{ fontSize: "13px", color: "#888", marginTop: "6px", textAlign: "center" }}>
      * Uploaded proof of purchase
    </p>
  </div>

  {/* Expense Details */}
  <div style={{ fontSize: "15px", color: "#444", lineHeight: "1.7" }}>
    <p><strong>Employee ID:</strong> {data.emp_id}</p>
    <p><strong>Expense ID:</strong> {data.expence_id}</p>
    <p><strong>Amount:</strong> ৳{data.amount}</p>
    <p>
      <strong>Status:</strong> 
      <span 
        className="ms-2 px-3 py-1 rounded-pill"
        style={{ 
          backgroundColor: data.status === 'pending' ? "#fff3cd" : 
                           data.status === 'accepted' ? "#d4edda" : "#f8d7da",
          color: data.status === 'pending' ? "#856404" : 
                 data.status === 'accepted' ? "#155724" : "#721c24",
          fontWeight: "500",
          fontSize: "13px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        {data.status}
      </span>
    </p>
    <p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
  </div>
</div>



  
  )
}
