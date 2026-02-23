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
  const [activeTab, setActiveTab] = useState('google');

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
      console.log("🔐 Email login attempt:", email);
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email, password
      });
      const { token, user } = response.data;
      
      // ✅ FETCH COMPLETE DATA for email users too
      const fullUserRes = await axios.get(`http://localhost:8080/api/students/${user.id}`);
      const fullUser = fullUserRes.data;
      
      const studentData = {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        enrolledSports: fullUser.sports || []  // Now gets real sports!
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
      
      console.log("🔐 Google login:", googleUser.email);
      const res = await axios.get("http://localhost:8080/api/students");
      const user = res.data.find(u => u.email === googleUser.email);
      
      if (!user) {
        setLoginError(`❌ "${googleUser.email}" not found! Admin must register first.`);
        return;
      }

      // ✅ FETCH COMPLETE USER DATA with sports
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
        enrolledSports: fullUser.sports || []  // Complete sports data!
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

  // Rest of JSX unchanged...
  return (
    <div className="login-page-container">
      <div className="login-header">
        <h1>Dorustree Sports Academy</h1>
        <p>🔐 Choose your login method</p>
      </div>

      <div className="login-card" style={{ maxWidth: "450px", margin: "0 auto", padding: "40px", textAlign: "center" }}>
        <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('google')} className={activeTab === 'google' ? 'tab-active' : 'tab'} style={{
            flex: 1, padding: '12px', border: 'none', background: 'none',
            fontSize: '16px', fontWeight: activeTab === 'google' ? 'bold' : 'normal',
            borderBottom: activeTab === 'google' ? '3px solid #1e3a8a' : 'none',
            color: activeTab === 'google' ? '#1e3a8a' : '#6b7280'
          }}>
            Google Login
          </button>
          <button onClick={() => setActiveTab('email')} className={activeTab === 'email' ? 'tab-active' : 'tab'} style={{
            flex: 1, padding: '12px', border: 'none', background: 'none',
            fontSize: '16px', fontWeight: activeTab === 'email' ? 'bold' : 'normal',
            borderBottom: activeTab === 'email' ? '3px solid #1e3a8a' : 'none',
            color: activeTab === 'email' ? '#1e3a8a' : '#6b7280'
          }}>
            Email/Password
          </button>
        </div>

        {activeTab === 'google' && (
          <div>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google login failed")}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                style={{ width: "100%", height: "56px" }}
              />
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Use your Google account registered with admin
            </p>
          </div>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{display:"block", marginBottom:"5px", fontWeight:"bold"}}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "boxSizing" }} />
            </div>
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{display:"block", marginBottom:"5px", fontWeight:"bold"}}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "boxSizing" }} />
            </div>
            {loginError && <div style={{ color: "red", marginBottom: "15px" }}>{loginError}</div>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px", background: "#1e3a8a", color: "white", 
              border: "none", borderRadius: "8px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Frontpage;
