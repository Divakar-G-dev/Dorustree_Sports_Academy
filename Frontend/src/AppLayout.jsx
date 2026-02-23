import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import Header from "./components/Header/Header.jsx";
import "./layout.css";

function AppLayout() {
  console.log("🔍 ADMIN LAYOUT LOADED");
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
