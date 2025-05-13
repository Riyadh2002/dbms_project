import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { UserContext } from '../Employee/Usercontext';

export default function AcceptedTask() {
    const [Request, setRequest] = useState([]);
  const { userEmail } = useContext(UserContext);
  const navigate = useNavigate();

const [email, setEmail] = useState("");
    
      useEffect(() => {
        const em = localStorage.getItem("email");
        setEmail(em);  
        console.log(em);  
      }, []);
  console.log(Request)
  useEffect(() => {
    fetch("http://localhost:3000/approvedtask", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
      .then(res => res.json())
      .then(data => {
        setRequest(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [email]);

  const handleViewDetails = (item) => {
    navigate('/details', { state: { data: item } });
  };

  return (
    <>
    <div className="container mt-4">
  <h4 className="mb-4 fw-semibold text-info border-bottom pb-2">
    <i className="bi bi-clock-history me-2"></i>Approved Requests
  </h4>

  {Array.isArray(Request) && Request.length > 0 ? (
    Request.map((item, index) => (
      <div
        key={index}
        className="card mb-4 border-0 rounded-4"
        style={{
          background: "#fff",
          borderLeft: `6px solid ${
            item.status === "accepted"
              ? "#198754" // green
              : item.status === "rejected"
              ? "#dc3545" // red
              : "#ffc107" // yellow
          }`,
          transition: "box-shadow 0.3s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)")
        }
      >
        <div className="card-body d-flex justify-content-between align-items-center">
  <div className="text-start">
    {/* <h5 className="fw-semibold text-dark mb-2 pl-500">{item.title}</h5> */}
    <p className="mb-1 text-muted size-15">
      <i className="bi bi-person me-2"></i>
      <strong>{item.title}</strong> 
    </p>


    <p className="mb-1 text-muted">
      <i className="bi bi-person me-2"></i>
      <strong>Employee ID:</strong> {item.emp_id}
    </p>

    <p className="mb-1 text-muted">
      <i className="bi bi-file-earmark-text me-2"></i>
      <strong>Expense ID:</strong> {item.expence_id}
    </p>

    <p className="mb-1 text-muted">
      <i className="bi bi-cash-coin me-2"></i>
      <strong>Amount:</strong> ৳{item.amount}
    </p>

    <span
      className={`badge rounded-pill px-3 py-2 mt-2 fw-medium ${
        item.status === "accepted"
          ? "bg-success-subtle text-success border border-success"
          : item.status === "rejected"
          ? "bg-danger-subtle text-danger border border-danger"
          : "bg-warning-subtle text-warning border border-warning"
      }`}
    >
      {item.status}
    </span>
  </div>

  <button
    className="btn btn-outline-info btn-sm px-4 py-2 rounded-pill"
    onClick={() => handleViewDetails(item)}
  >
    View Details
  </button>
</div>

      </div>
    ))
  ) : (
    <div className="alert alert-secondary">No approved requests found.</div>
  )}
</div>


    </>
  )
}
