import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import './UserProfile.css';
import { toast } from "react-toastify";

const UserProfile = () => {
  const { studentData, updateStudentData } = useContext(UserContext);
  const [editing, setEditing] = useState(false); // toggles inline edit mode
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch student data when login/student ID is available
  useEffect(() => {
    if (studentData?.id) {
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
          dob: res.data.dob ? res.data.dob.split('T')[0] : "",
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

  // Track changes in the table inputs
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Submit updated profile
  const handleSubmit = async () => {
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

      updateStudentData({ profile }); // Update context
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Save failed: " + (err.response?.data?.message || err.message));
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

        {/* Profile Table */}
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
                    {editing ? (
                      <input
                        type={key === "dob" ? "date" : "text"}
                        name={key}
                        value={profile[key] || ""}
                        onChange={handleChange} // inline changes
                        disabled={loading}
                        className="table-input"
                      />
                    ) : (
                      key === "dob"
                        ? profile[key]
                          ? new Date(profile[key]).toLocaleDateString('en-IN')
                          : "Not set"
                        : profile[key] || "Not set"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons */}
          <div className="edit-action" style={{justifyContent:"space-between"}}>
            {editing ? (
              <>
                <button
                  className="save-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                  
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setProfile(studentData.profile || profile); // revert changes
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;