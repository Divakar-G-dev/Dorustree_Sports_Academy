import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./components/Header/UserHeader.jsx";
import UserSidebar from "./components/Sidebar/UserSidebar.jsx";

const UserLayout = () => {
  console.log("🔍 USER LAYOUT RENDERED!");
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <UserSidebar />
      <div style={{ flex: 1, marginLeft: '250px', padding: '20px', marginTop: '80px' }}>
        <UserHeader />
        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
