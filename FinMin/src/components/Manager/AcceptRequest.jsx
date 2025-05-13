import React, { useState ,useEffect} from 'react'
import { data, useLocation, useNavigate } from 'react-router'



export default function AcceptRequest() {
  const location=useLocation()
  const data=location.state?.data
  const navigate=useNavigate()

  const [email, setEmail] = useState("");
      
        useEffect(() => {
          const em = localStorage.getItem("email");
          setEmail(em);  
          console.log(em);  
        }, []);

  const handleAccept=()=>{
    fetch("http://localhost:3000/manageraccept", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      }
      ,body:JSON.stringify({
        expence_id:data.expence_id,
        email:email,
        amount:data.amount
      })
    })
    .then(res=>res.json())
    .then(message=>{
      if(message="Request accepted successfully"){
        navigate("/pendingreq", { replace: true });
      }
    })
  }
  return (
    <>
    <div 
  className="card shadow p-4 rounded-4 mx-auto mt-5"
  style={{
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: "1px solid #e0e0e0"
  }}
>
  {/* Title */}
  <h4 
    className="mb-4 text-center"
    style={{ fontWeight: "600", color: "#00BCD4", letterSpacing: "0.5px" }}
  >
    Expense Request Overview
  </h4>

  {/* Image */}
  <div className="mb-4 text-center">
    <img 
      src={data.image_url}
      alt="Proof"
      style={{ 
        width: "100%", 
        height: "auto", 
        borderRadius: "12px", 
        border: "1px solid #ccc", 
        objectFit: "cover" 
      }}
    />
    <small className="text-muted d-block mt-2">Uploaded expense proof</small>
  </div>

  {/* Details */}
  <div style={{ fontSize: "15px", color: "#333", lineHeight: "1.8" }}>
    <p><strong>Title:</strong> {data.title}</p>
    <p><strong>Employee ID:</strong> {data.emp_id}</p>
    <p><strong>Expence ID:</strong> {data.expence_id}</p>
    <p><strong>Amount:</strong> ৳{data.amount}</p>
    <p><strong>Status:</strong> 
      <span 
        className="ms-2 px-3 py-1 rounded-pill"
        style={{
          backgroundColor: data.status === 'pending' ? "#fff3cd" : 
                           data.status === 'accepted' ? "#d4edda" : "#f8d7da",
          color: data.status === 'pending' ? "#856404" : 
                 data.status === 'accepted' ? "#155724" : "#721c24",
          fontWeight: "500",
          fontSize: "13px"
        }}
      >
        {data.status}
      </span>
    </p>
    <p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
  </div>

  {/* Action Buttons */}
  {data.status === "pending" && (
    <div className="d-flex justify-content-between mt-4">
      <button 
        className="btn btn-success px-4 py-2 rounded-pill"
        onClick={handleAccept}
      >
        ✅ Accept
      </button>
      <button 
        className="btn btn-danger px-4 py-2 rounded-pill"
        // onClick={handleReject}
      >
        ❌ Reject
      </button>
    </div>
  )}
</div>

    </>
  )
}
