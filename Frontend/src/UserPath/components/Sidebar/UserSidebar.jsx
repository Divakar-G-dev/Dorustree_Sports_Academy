import React from "react";
import { NavLink } from "react-router-dom";
import BarImg from "/src/assets/Bar.png";
import "./userSidebar.css";

const UserSidebar = () => {
  return (
    <div className="user-navbar">
      <div className="top-logo">
        <img src={BarImg} alt="Menu" className="nav-icon" />
      </div>

      <NavLink to="/user/profile" className="nav-item">
        <img src="/src/UserPath/assets/student.png" className="nav-icon"/>
        <span>Profile</span>
      </NavLink>

      <NavLink to="/user/enrolled-sports" className="nav-item">
        <img src="/src/UserPath/assets/Mysport.png" className="nav-icon"/>
        <span>My Sports</span>
      </NavLink>

      <NavLink to="/user/edit-sports" className="nav-item">
        <img src="/src/UserPath/assets/Edit.png" className="nav-icon"/>
        <span>Edit Sports</span>
      </NavLink>

      <NavLink to="/user/about-us" className="nav-item">
        <img src="/src/UserPath/assets/dorustree-logo-2.png" className="nav-icon"/>
        <span>About Us</span>
      </NavLink>


    </div>
  );
};

export default UserSidebar;
