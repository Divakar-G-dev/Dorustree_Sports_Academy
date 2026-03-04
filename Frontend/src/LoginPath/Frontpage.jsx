import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';  
import { useNavigate } from "react-router-dom";
import { UserContext } from "/src/UserPath/context/UserContext.jsx";  
import { toast } from 'react-toastify';  // Import toast
import "./frontpage.css";

function Frontpage() {
  const navigate = useNavigate();
  const { updateStudentData } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Redirect if user already logged in
  useEffect(() => {
    const studentData = sessionStorage.getItem('studentData');
    if (studentData) {
      const user = JSON.parse(studentData);
      user.role === "Admin"
        ? navigate("/dashboard", { replace: true })
        : navigate("/user", { replace: true });
    }
  }, [navigate]);

  // Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email, password
      });

      const { token, user } = response.data;

      const fullUserRes = await axios.get(`http://localhost:8080/api/students/${user.id}`);
      const fullUser = fullUserRes.data;

      const studentData = {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        enrolledSports: fullUser.sports || []
      };

      // Update context
      updateStudentData(studentData);

      // Store backend token
      sessionStorage.setItem('authToken', token);

      // Success toast
      toast.success(` Welcome ${user.profile.firstName}!`);

      // Navigate after a short delay so toast can render
      setTimeout(() => {
        user.role === "Admin"
          ? navigate("/dashboard", { replace: true })
          : navigate("/user", { replace: true });
      }, 200);

    } catch (error) {
      const msg = error.response?.data?.error || "Login failed";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.credential;

      const decoded = JSON.parse(atob(googleToken.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
      const googleEmail = decoded.email;

      const res = await axios.get("http://localhost:8080/api/students");
      const user = res.data.find(u => u.email === googleEmail);

      if (!user) {
        const msg = `"${googleEmail}" not found! Admin must register first.`;
        setLoginError(msg);
        toast.error(msg);
        return;
      }

      const fullUserRes = await axios.get(`http://localhost:8080/api/students/${user.studentId}`);
      const fullUser = fullUserRes.data;

      const studentData = {
        id: user.studentId,
        email: user.email,
        role: user.role,
        profile: { 
          firstName: fullUser.firstName || user.firstName, 
          lastName: fullUser.lastName || user.lastName, 
          phone: fullUser.phone || user.phone 
        },
        enrolledSports: fullUser.sports || []
      };

      updateStudentData(studentData);
      sessionStorage.setItem('authToken', googleToken);

      toast.success(`Welcome ${studentData.profile.firstName}!`);

      setTimeout(() => {
        user.role === "Admin"
          ? navigate("/dashboard", { replace: true })
          : navigate("/user", { replace: true });
      }, 200);

    } catch (error) {
      console.error("Google login failed:", error);
      const msg = "Google login failed - check console";
      setLoginError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-header">
        <div onClick={()=>navigate("/login")} className="inside-head">
            <img  src="src/AdminPath/assets/dorustree-logo-2.png" alt="Dorustree Logo" />
            <h1>
              <span className="head-word1" style={{color:"#fbda3d" }}>orustree </span>
              <span className="head-word2" >Sports </span>
              <span className="head-word3" >Academy</span>
            </h1>
        </div>
        <p>Sign in to your account</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                height: "1px",
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                boxSizing: "border-box",
                background: "#fafbfc"
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                boxSizing: "border-box",
                background: "#fafbfc"
              }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {loginError && <div className="error-text">{loginError}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            className="glog"
            style={{ width: "100%", height: "56px"}}
          />
          <p className="google-hint">
            Use your Google account registered with admin
          </p>
        </div>
      </div>
    </div>
  );
}

export default Frontpage;