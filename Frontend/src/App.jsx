import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';  

// Your existing imports
import Frontpage from "./pages/frontpage/Frontpage.jsx";
import AppLayout from "./AppLayout.jsx";  // Admin layout
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Students from "./components/studentList/Student.jsx";
import Sports from "./components/sportsListA/Sportslist.jsx";
import Enrollsports from "./components/enrollsports/Enrollsports.jsx";
import UserLayout from "./UserPath/UserLayout.jsx";
import UserProfile from "./UserPath/pages/UserProfile/UserProfile.jsx";


import EnrolledSports from "./UserPath/pages/EnrolledSports/EnrolledSports.jsx";
import EditSports from "./UserPath/pages/EditSports/EditSports.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="301875341554-gv5ube8pac68j1naagktv2r9smh3d4fp.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frontpage />} />
          
          {/* ✅ ADMIN WITH LAYOUT */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/enrollsports" element={<Enrollsports />} />
            </Route>
          </Route>

          {/* ✅ STUDENT WITH LAYOUT */}
          <Route element={<ProtectedRoute allowedRoles={["Student", "Admin"]} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserProfile />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="enrolled-sports" element={<EnrolledSports />} />
              <Route path="edit-sports" element={<EditSports />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
