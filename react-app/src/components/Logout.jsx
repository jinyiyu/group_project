// src/components/Logout.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        alert("Logout successful");
        navigate("/"); // Redirect to homepage
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <div>
      <h2>Are you sure you want to logout?</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
