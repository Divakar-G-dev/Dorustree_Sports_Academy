import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ background: "#1e3a8a", padding: "10px", color: "#fff" }}>
      <Link to="/user/profile" style={{ margin: "0 10px", color: "#fff" }}>Profile</Link>
      <Link to="/user/enrolled-sports" style={{ margin: "0 10px", color: "#fff" }}>My Sports</Link>
      <Link to="/user/edit-sports" style={{ margin: "0 10px", color: "#fff" }}>Edit Sports</Link>
    </nav>
  );
};