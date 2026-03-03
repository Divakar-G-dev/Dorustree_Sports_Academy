import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import './EditSports.css';
import { toast } from "react-toastify";

const EditSports = () => {
  const { studentData, updateStudentData } = useContext(UserContext);
  const [allSports, setAllSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchAllSports(); }, []);
  
  useEffect(() => {
    if (studentData.enrolledSports?.length > 0) {
      setSelectedSports(studentData.enrolledSports.map(s => s.id));
    }
  }, [studentData.enrolledSports]);

  const fetchAllSports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students/all-sports");
      setAllSports(res.data);
    } catch (err) {
      console.error("Error fetching sports:", err);
    }
  };

  const normalizeTiming = (timing) => {
    if (!timing) return "";
    return timing.toLowerCase()
      .replace(/\./g, ':')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const toggleSport = (sportId) => {
    if (selectedSports.includes(sportId)) {
      setSelectedSports(selectedSports.filter(id => id !== sportId));
      setErrors({});
      return;
    }

    const sport = allSports.find(s => s.id === sportId);
    const currentlySelectedSports = selectedSports
      .map(id => allSports.find(s => s.id === id))
      .filter(Boolean);
      
    const normalizedSportTiming = normalizeTiming(sport.timing);
    const hasTimeConflict = currentlySelectedSports.some(selectedSport => 
      normalizeTiming(selectedSport.timing) === normalizedSportTiming
    );

    if (hasTimeConflict) {
      const conflictingSports = currentlySelectedSports
        .filter(s => normalizeTiming(s.timing) === normalizedSportTiming)
        .map(s => `"${s.name}"`)
        .join(", ");
      
      toast.error(`Cannot select "${sport.name}"!\n${sport.timing} already used by: ${conflictingSports}`);
      return;
    }

    setSelectedSports([...selectedSports, sportId]);
    setErrors({});
  };

  const validateSelection = () => {
    const newErrors = {};
    if (selectedSports.length === 0) {
      newErrors.sports = "At least one sport must be selected!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSelection()) return;
    setLoading(true);
    try {
      const payload = { sportIds: selectedSports };
      await axios.put(`http://localhost:8080/api/students/${studentData.id}`, payload);
      const selectedSportsData = allSports.filter(s => selectedSports.includes(s.id));
      updateStudentData({ enrolledSports: selectedSportsData });
      toast.success("Sports updated successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to update sports";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const totalFees = allSports
    .filter(s => selectedSports.includes(s.id))
    .reduce((sum, s) => sum + (s.fees || 0), 0);

  if (studentData.loading || !studentData.id) {
    return <div className="loading-container">Loading sports...</div>;
  }

  return (
    <div className="edit-sports-page">
      <div className="edit-sports-content">
        <div className="header-section">
          <h2 className="page-title">Edit Sports</h2>
          <p className="page-rule">One sport per time slot only</p>
        </div>

        {errors.sports && <div className="error-message">{errors.sports}</div>}

        <div className="sports-list">
          {allSports.map((sport) => (
            <div 
              key={sport.id}
              className={`sport-item ${selectedSports.includes(sport.id) ? 'selected' : ''}`}
              onClick={() => toggleSport(sport.id)}
            >
              <label className="sport-label">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport.id)}
                  onChange={() => toggleSport(sport.id)}
                />
                <div className="sport-content">
                  <div className="sport-name">{sport.name}</div>
                  <div className="sport-timing">{sport.timing}</div>
                  <div className="sport-fee">₹{sport.fees?.toLocaleString("en-IN")}</div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="footer-section">
          <div className="total-container">
            <span className="total-label">Total:</span>
            <span className="total-value">₹{totalFees.toLocaleString("en-IN")}</span>
            <span className="total-count">({selectedSports.length} sports)</span>
          </div>
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={loading || selectedSports.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              `Save Changes (${selectedSports.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSports;
