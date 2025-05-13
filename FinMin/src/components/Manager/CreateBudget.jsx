import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { UserContext } from '../Employee/Usercontext';
import { useNavigate } from "react-router";


const CreateBudget = () => {
  const [totalBudget, setTotalBudget] = useState("");
const navigate=useNavigate()
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
    const [managerid,setmanagerid]=useState("")
        const { userEmail } = useContext(UserContext);

        const [email, setEmail] = useState("");

  useEffect(() => {
    const em = localStorage.getItem("email");
    setEmail(em);  
    console.log(em);  
  }, []);
    


        const handleSubmit = (e) => {
            e.preventDefault();
          
            // Basic validation
            if (!totalBudget || !month || !year) {
              alert("❌ Please fill in all fields.");
              return;
            }
          
            const budgetData = {
              email: email,
              total_budget: totalBudget,
              month,
              year,
            };
          
            fetch("http://localhost:3000/createbudget", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(budgetData),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.message === "Budget created successfully") {
                  alert("✅ Budget Created!");
                  navigate("/budget")
                } else {
                  alert(`❌ ${data.error || "Something went wrong!"}`);
                }
              })
              .catch((err) => {
                console.log("Error:", err);
                // alert("❌ Failed to create budget. Please try again later.");
                navigate("/budget")
              });
          };
          

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "28rem", borderRadius: "1rem" }}>
        <h3 className="text-center mb-4 text-primary">Create Budget</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Total Budget (৳)</label>
            <input
              type="number"
              className="form-control"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="Enter total budget"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Month</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="">Select month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year (e.g., 2025)"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBudget;
