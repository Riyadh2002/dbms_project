import React, { useEffect , useContext, useState, } from 'react';
import { UserContext } from './Usercontext'; // Corrected
import { useNavigate } from 'react-router';

export default function Accepted() {
  const { userEmail } = useContext(UserContext);
  const [Request,setRequest]=useState([])
  const navigate=useNavigate()

  const [email, setEmail] = useState("");
      
        useEffect(() => {
          const em = localStorage.getItem("email");
          setEmail(em);  
          console.log(em);  
        }, []);
  useEffect(() => {
    fetch("http://localhost:3000/accepted", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("data from accept:", data);
      setRequest(data)
    })
    .catch(error => {
      console.log(error);
    });
  }, [email]);
  
  const handleViewDetails=(item)=>{
    navigate('/details', { state: { data: item } });
  }
  return (
    <>
      {Array.isArray(Request) && Request.map((item, index) => (
  <div
    key={index}
    className="card mb-3 shadow-sm p-3 rounded-4"
    style={{
      backgroundColor: "#f9f9f9", 
      borderLeft: "6px solid #00BCD4", 
      transition: "transform 0.3s ease, box-shadow 0.3s ease", 
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h5 style={{
          fontWeight: "500", 
          color: "#333", 
          fontSize: "20px", 
          opacity: "0.8.5"
        }}>
          {item.title}
        </h5>
        <p style={{
          margin: 0, 
          fontSize: "14px", 
          color: "#666", 
          opacity: "0.8"
        }}>
          Employee ID: <strong>{item.emp_id}</strong>
        </p>
        <p style={{
          margin: 0, 
          fontSize: "14px", 
          color: "#666", 
          marginTop: "4px", 
          opacity: "0.8"
        }}>
          Amount: ৳{item.amount}
          <span
            className="ms-3 px-3 py-1 rounded-pill"
            style={{
              backgroundColor: "#00BCD4",
              color: "#fff",
              fontWeight: "500",
              fontSize: "13px",
              border: "1px solid #00BCD4"
            }}
          >
            {item.status}
          </span>
        </p>
      </div>

      <button
  className="btn btn-outline-info btn-sm px-3"
  style={{
    borderRadius: "25px", 
    fontSize: "14px", 
    padding: "8px 16px", 
    color: "#00BCD4", 
    border: "1px solid #00BCD4", 
    transition: "background-color 0.3s ease, color 0.3s ease",
    opacity: "0.7"
  }}
  onClick={() => handleViewDetails(item)}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#00BCD4";
    e.currentTarget.style.color = "white";  
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#00BCD4";  
  }}
>
  View Details
</button>

    </div>
  </div>
))}
    </>
  );
}
