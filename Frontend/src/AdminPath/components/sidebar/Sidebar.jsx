import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

import DashboardImg from "/src/AdminPath/assets/Dashboard.png";
import EnrollImg from "/src/AdminPath/assets/Enroll.png";
import SportImg from "/src/AdminPath/assets/Mysport.png";
import StudentImg from "/src/AdminPath/assets/student.png";
import BarImg from "/src/AdminPath/assets/Bar.png";

function Sidebar() {
  return (
    <div className="navbar">

      <div className="top-logo">
        <img src={BarImg} alt="Menu" className="nav-icon" style={{marginTop:"8px"}}/>
      </div>

      <NavLink to="/dashboard" className="nav-item">
        <img src={DashboardImg} alt="Dashboard" className="nav-icon" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/sports" className="nav-item">
        <img src={SportImg} alt="Sports" className="nav-icon" />
        <span>Sports</span>
      </NavLink>

      <NavLink to="/students" className="nav-item">
        <img src={StudentImg} alt="Students" className="nav-icon" />
        <span>Students</span>
      </NavLink>

      <NavLink to="/enrollsports" className="nav-item">
        <img src={EnrollImg} alt="Enroll"  className="nav-icon" />
        <span>Enroll</span>
      </NavLink>

    </div>
  );
}

export default Sidebar;
