import React from "react";
import "./userHeader.css";
import studentIcon from "/src/AdminPath/assets/Admin.jpg"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const UserHeader = () => {
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
