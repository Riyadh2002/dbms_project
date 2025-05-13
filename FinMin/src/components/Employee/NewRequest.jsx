import React, { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../Employee/Usercontext';

import { FaCalendarAlt, FaMoneyBillWave, FaFileAlt, FaUserTie, FaUser, FaImage, FaHeading } from "react-icons/fa";

export default function NewRequest() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const { userEmail } = useContext(UserContext);

  const [email, setEmail] = useState("");
            
              useEffect(() => {
                const em = localStorage.getItem("email");
                setEmail(em);  
                console.log(em);  
              }, []);
  // Frontend: ExpenseForm.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
        title,
        amount: Number(amount),
        description,
        date,
        email: email,
        status: "pending",
      };
      
      console.log("expense data:", expenseData);
      
      try {
        const response = await fetch("http://localhost:3000/newrequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // send as JSON
          },
          body: JSON.stringify(expenseData), // Send data as JSON
        });
      
        if (response.ok) {
          const result = await response.json();
          console.log("Expense successfully submitted:", result);
          navigate("/employee", { replace: true });
          setTitle("");
          setAmount("");
          setDescription("");
          setDate("");
          setImage(null);
          
        } else {
          console.error("Error submitting expense:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
      
  };


  return (
    <div className="container mt-5">
      <form className="p-4 shadow-sm rounded bg-white" style={{ fontFamily: "'Lato', sans-serif", maxWidth: "600px", margin: "auto" }}>
        <h4 className="mb-4 text-center" style={{ color: "#00BCD4" }}>Submit New Expense</h4>

        <div className="mb-3">
          <label className="form-label"><FaHeading className="me-2" />Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><FaMoneyBillWave className="me-2" />Amount (৳)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><FaFileAlt className="me-2" />Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><FaCalendarAlt className="me-2" />Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><FaImage className="me-2" />Upload Image (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="btn btn-info w-100 text-white"
          onClick={handleSubmit}
        >
          Submit Expense
        </button>
      </form>
    </div>
  );
}
