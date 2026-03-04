import React from "react";
import "./header.css";
import adminIcon from "/src/AdminPath/assets/Admin.jpg"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
            Swal.fire({
              title: 'Are you sure?',
              text: "You will be logged out!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#f44336',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, logout!'
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.removeItem('studentData');
                sessionStorage.removeItem('authToken');
                window.location.href = "/";
              }
            });
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
