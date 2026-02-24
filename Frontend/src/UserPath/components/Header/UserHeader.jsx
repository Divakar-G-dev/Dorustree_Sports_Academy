import React from "react";
import "./userHeader.css";
import studentIcon from "/src/assets/Admin.jpg"; 
import { useNavigate } from "react-router-dom";

const UserHeader = () => {
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
    <div className="user-head-section">
      <div className="user-head">
        <div className="user-head-left">
          <h1 onClick={() => navigate("/user/profile")}>Dorustree Sports Academy</h1>
          <p className="user-head-below">Students Enrollment Management System</p>
        </div>

        <div className="user-header-right">
          <div className="student-info">
            <img src={studentIcon} alt="Student" className="student-icon" />
            <span className="student-name">Student</span>
          </div>

          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
