import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';  
import { useNavigate } from "react-router-dom";
import "./frontpage.css";

function Frontpage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const studentData = sessionStorage.getItem('studentData');
    if (studentData) {
      const user = JSON.parse(studentData);
      console.log("Auto-redirect user:", user.role);
      user.role === "Admin" ? navigate("/dashboard", { replace: true }) : navigate("/user", { replace: true });
    }
  }, [navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      console.log(" Email login attempt:", email);
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
      
      sessionStorage.setItem('studentData', JSON.stringify(studentData));
      sessionStorage.setItem('authToken', token);
      
      console.log("✅ Email login COMPLETE data:", studentData.enrolledSports.length, "sports");
      alert(`✅ Welcome ${user.role}: ${user.profile.firstName}!`);
      user.role === "Admin" ? navigate("/dashboard", { replace: true }) : navigate("/user", { replace: true });
    } catch (error) {
      console.error("❌ Email login failed:", error.response?.data);
      setLoginError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      let googleUser = response.profileObj || JSON.parse(atob(response.credential.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
      
      console.log(" Google login:", googleUser.email);
      const res = await axios.get("http://localhost:8080/api/students");
      const user = res.data.find(u => u.email === googleUser.email);
      
      if (!user) {
        setLoginError(`❌ "${googleUser.email}" not found! Admin must register first.`);
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

      sessionStorage.setItem('studentData', JSON.stringify(studentData));
      sessionStorage.setItem('authToken', 'google_' + Date.now());

      console.log("✅ Google login COMPLETE data:", studentData.enrolledSports.length, "sports");
      alert(`✅ Welcome ${user.role}: ${user.firstName}! (${studentData.enrolledSports.length} sports)`);
      user.role === "Admin" ? navigate("/dashboard", { replace: true }) : navigate("/user", { replace: true });
    } catch (error) {
      console.error("❌ Google login failed:", error);
      setLoginError("Google login failed - check console");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-header">
        <div className="inside-head">
            <img src="src/assets/dorustree-logo-2.png" ></img>
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
            <label >Email</label>
            <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{
    width: "100%",
    height: "1px",           // match password height
    padding: "12px 16px",     // vertical + horizontal padding
    fontSize: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "#fafbfc",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none"
  }}
/>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input style={{
    width: "100%",        
    padding: "12px 16px",     
    fontSize: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "#fafbfc",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none"
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
            onError={() => alert("Google login failed")}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            className="glog"
            style={{ width: "100%", height: "56px"}}
          />
          <p className="google-hint">Use your Google account registered with admin</p>
        </div>
      </div>
    </div>
  );
}

export default Frontpage;
