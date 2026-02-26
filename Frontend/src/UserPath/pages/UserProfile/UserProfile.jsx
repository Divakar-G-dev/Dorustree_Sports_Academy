import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import './UserProfile.css';

const UserProfile = () => {
  const { studentData, updateStudentData } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (studentData?.id) { // this is only after login that student is enrolled or not, then detials need to be viewed
      fetchStudentData();
    }
  }, [studentData?.id]);

  const fetchStudentData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/students/${studentData.id}`);
      const fullData = {
        id: res.data.studentId,
        email: res.data.email || studentData.email,
        profile: {
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || "",
          parentName: res.data.parentName || "",
          dob: res.data.dob ? (res.data.dob.split('T')[0] || "") : "",
          emergencyContact: res.data.emergencyContact || ""
        },
        enrolledSports: res.data.sports || []
      };
      updateStudentData(fullData);
      setProfile(fullData.profile);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err.response?.status, err.response?.data || err.message);
      if (studentData.profile) {
        setProfile(studentData.profile);
      }
    }
  };

  useEffect(() => {
    if (studentData?.profile) {
      setProfile(studentData.profile);
    }
  }, [studentData?.profile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:8080/api/students/${studentData.id}`, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        parentName: profile.parentName,
        dob: profile.dob,
        emergencyContact: profile.emergencyContact,
        sportIds: studentData.enrolledSports.map(s => s.id).filter(id => id)
      });

      updateStudentData({ profile });
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!studentData || studentData.loading || !studentData.id) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Student';

  const fields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'parentName', label: 'Parent/Guardian' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'emergencyContact', label: 'Emergency Contact' }
  ];

  return (
    <div className="profile-page">
      <div className="profile-main-content">
        {/* Welcome Header */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome back!</h1>
            <p className="welcome-name">{fullName}</p>
            <p className="welcome-subtitle">Manage your profile information</p>
          </div>
        </div>

        {/* Profile Display + Edit Toggle */}
        <div className="profile-display-section">
          <div className="display-header">
            <h2>Profile Information</h2>
          </div>
          
          <table className="profile-table">
            <tbody>
              {fields.map(({ key, label }) => (
                <tr key={key}>
                  <td className="label-cell">{label}</td>
                  <td className="value-cell">
                    {key === "dob" ? 
                      (profile[key] ? new Date(profile[key]).toLocaleDateString('en-IN') : 'Not set') : 
                      (profile[key] || 'Not set')
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Button Below Table */}
          {!editing && (
            <div className="edit-action">
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Edit Form - Hidden when not editing */}
        {editing && (
          <div className="edit-section">
            <div className="edit-header">
              <h2>Edit Profile</h2>
              <button className="close-edit" onClick={() => setEditing(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="edit-form">
              <table className="form-table">
                <tbody>
                  {fields.map(({ key, label }) => (
                    <tr key={key}>
                      <td className="label-cell">{label}</td>
                      <td className="input-cell">
                        <input
                          type={key === "dob" ? "date" : "text"}
                          name={key}
                          value={profile[key] || ""}
                          onChange={handleChange}
                          disabled={loading}
                          className="table-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="form-buttons">
                <button type="submit" disabled={loading} className="save-btn">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    setEditing(false); 
                    setProfile(studentData.profile || profile); 
                  }} 
                  disabled={loading}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
