import React from "react";
import "./header.css";
import adminIcon from "/src/assets/Admin.jpg"; 
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    sessionStorage.removeItem('studentData');
    sessionStorage.removeItem('authToken');
    window.location.href = "/";
  }
};
 

  return (
    <div className="head-section">
      <div className="head">
        <div className="head-left">
          <h1 onClick={() => navigate("/dashboard")}>Dorustree Sports Academy</h1>
          <p className="head-below">Students Enrollment Management System</p>
        </div>

        <div className="header-right">
          <div className="admin-info">
            <img src={adminIcon} alt="Admin" className="admin-icon" />
            <span className="admin-name">Admin</span>
          </div>

          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
