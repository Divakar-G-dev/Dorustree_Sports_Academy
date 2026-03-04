import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';  
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Frontpage from "./LoginPath/Frontpage.jsx";
import AppLayout from "./AppLayout.jsx";  
import Dashboard from "/src/AdminPath/pages/dashboard/Dashboard.jsx";
import Students from "./AdminPath/pages/studentList/Student.jsx";
import Sports from "./AdminPath/pages/sportsListA/Sportslist.jsx";
import Enrollsports from "./AdminPath/pages/enrollsports/Enrollsports.jsx";
import UserLayout from "./UserPath/UserLayout.jsx";
import UserProfile from "./UserPath/pages/UserProfile/UserProfile.jsx";
import EnrolledSports from "./UserPath/pages/EnrolledSports/EnrolledSports.jsx";
import EditSports from "./UserPath/pages/EditSports/EditSports.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AboutUs from "./UserPath/pages/AboutUs/AboutUs.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="301875341554-gv5ube8pac68j1naagktv2r9smh3d4fp.apps.googleusercontent.com">
      <BrowserRouter>

        {/* Global Toast Container */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

        <Routes>
          <Route path="/" element={<Frontpage />} />

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/enrollsports" element={<Enrollsports />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Student", "Admin"]} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserProfile />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="enrolled-sports" element={<EnrolledSports />} />
              <Route path="edit-sports" element={<EditSports />} />
              <Route path="about-us" element={<AboutUs />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;