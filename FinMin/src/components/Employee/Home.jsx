import React from 'react'
import logo from './images/logo.png'
import background from "../Employee/images/background.jpg"
import { Link } from 'react-router'

export default function Home() {
  
  return (
    <>
     <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card p-4 text-center glass-card border-0" style={{ maxWidth: '400px' }}>
        <h4 className="mb-4 text-white fw-semibold">Continue to proceed</h4>
        <div className="d-flex flex-column gap-3">
  <Link to="/login" className="w-100">
    <button className="btn btn-outline-light glass-btn w-100">Login</button>
  </Link>
  <Link to="/signup" className="w-100">
    <button className="btn btn-outline-light glass-btn w-100">Sign Up</button>
  </Link>
</div>
      </div>
    </div>







    </>
  )
}
