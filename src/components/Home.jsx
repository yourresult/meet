import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Home() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [role, setRole] = useState(null); // Store the user's role

  // Check if the user is authenticated and retrieve the role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole); // Set the role if it exists
  }, []);

  const handleHelpClick = () => {
    navigate("/help"); // Navigate to /help when Help button is clicked
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="mb-3">Online Learning Platform</h1>
      <p className="mb-4">Your smart assistant on the web</p>
      <div className="w-100">
        {role === "admin" && (
          <button className="btn btn-lg btn-danger w-100 mb-3">Admin Dashboard</button>
        )}
        <a href="https://meet.jit.si/io9"><button className="btn btn-lg btn-success w-100 mb-3">Join Live Class</button></a>
        <button className="btn btn-lg btn-dark w-100" onClick={handleHelpClick}>Help</button>
      </div>
    </div>
  );
}