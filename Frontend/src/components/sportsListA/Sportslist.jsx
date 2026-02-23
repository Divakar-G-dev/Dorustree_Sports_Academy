import React, { useEffect, useState } from "react";
import axios from "axios";
import "./sportslista.css";

const Sportslist = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState({ name: "", fees: "", timing: "" });
  const [selectedSports, setSelectedSports] = useState([]);

  // LOAD SPORTS
  const fetchSports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sports");
      const sportsArray = res.data.map((s) => ({
        ...s,
        id: Number(s.id),
      }));
      setSports(sportsArray);
    } catch (err) {
      console.error("Error fetching sports:", err);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  // TIME CONFLICT CHECK
  const checkTimeConflict = (newTiming) => {
    return newTiming && sports.some(sport => sport.timing === newTiming);
  };

  // NEW: TIMING FORMAT VALIDATION
  const validateTimingFormat = (timing) => {
    if (!timing) return false;
    
    // Expected format: "6:00 AM - 7:30 AM" or "7.30 AM - 9.00 AM"
    const timePattern = /^(\d{1,2}:?\d{2}\s?(AM|PM|a\.m\.?|p\.m\.)?)\s*-\s*(\d{1,2}:?\d{2}\s?(AM|PM|a\.m\.?|p\.m\.)?)$/i;
    
    return timePattern.test(timing);
  };

  const handleAddSport = async () => {
    if (!newSport.name || !newSport.fees || !newSport.timing) {
      alert("Fill all fields");
      return;
    }

    if (sports.some((s) => s.name.toLowerCase() === newSport.name.toLowerCase())) {
      alert("Sport already exists");
      return;
    }

    //  TIMING FORMAT VALIDATION
    if (!validateTimingFormat(newSport.timing)) {
      alert(`Invalid timing format!\n\nUse format like: "6:00 AM - 7:30 AM"\nor "7.30 AM - 9.00 AM"`);
      return;
    }

    //  TIME CONFLICT CHECK
    if (checkTimeConflict(newSport.timing)) {
      const conflictingSport = sports.find(sport => sport.timing === newSport.timing);
      alert(`Cannot add "${newSport.name}"!\n\nTime ${newSport.timing} already used by:\n"${conflictingSport.name}"`);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/sports", {
        name: newSport.name,
        fees: parseInt(newSport.fees),
        timing: newSport.timing,
      });

      const addedSport = { ...res.data, id: Number(res.data.id) };
      setSports((prev) => [...prev, addedSport]);
      setNewSport({ name: "", fees: "", timing: "" });
      alert(`"${newSport.name}" added successfully!`);
    } catch (err) {
      alert("Failed to add sport");
    }
  };

  const handleSportSelect = (sportName) => {
    setSelectedSports((prevSelected) => {
      if (prevSelected.includes(sportName)) {
        return prevSelected.filter((name) => name !== sportName);
      } else {
        return [...prevSelected, sportName];
      }
    });
  };

  const handleDeleteSport = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/sports/${id}`);
      setSports((prevSports) => {
        const deletedSport = prevSports.find((s) => Number(s.id) === Number(id));
        if (deletedSport) {
          setSelectedSports((prevSelected) =>
            prevSelected.filter((name) => name !== deletedSport.name)
          );
        }
        return prevSports.filter((s) => Number(s.id) !== Number(id));
      });
      alert("Sport deleted successfully!");
    } catch (err) {
      alert("Failed to delete sport");
    }
  };

  const sortedSports = [...sports].sort((a, b) => {
    const aSelected = selectedSports.includes(a.name);
    const bSelected = selectedSports.includes(b.name);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="sportslist-container">
      <h2>Sports & Fees Management</h2>
      
      <table className="sportslist-table">
        <thead>
          <tr>
            <th>Sport</th>
            <th>Duration</th>
            <th>Timing</th>
            <th>Monthly Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedSports.map((sport) => (
            <tr key={sport.id}>
              <td>
                <span
                  onClick={() => handleSportSelect(sport.name)}
                  className={`sport-name ${selectedSports.includes(sport.name) ? 'selected' : ''}`}
                >
                  {sport.name}
                </span>
              </td>
              <td>1 hr 30 mins</td>
              <td><strong className="timing">{sport.timing}</strong></td>
              <td className="fees">₹{sport.fees.toLocaleString("en-IN")}</td>
              <td>
                <button
                  onClick={() => handleDeleteSport(sport.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD SPORT FORM */}
      <div className="add-sport-container">
        <h3>Add New Sport</h3>
        <div className="add-sport-form">
          <div className="form-group">
            <label>Sport Name</label>
            <input
              type="text"
              placeholder="e.g., Cricket"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Monthly Fees</label>
            <input
              type="number"
              placeholder="e.g., 1500"
              value={newSport.fees}
              onChange={(e) => setNewSport({ ...newSport, fees: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Timing (Unique)</label>
            <input
              type="text"
              placeholder="e.g., 6:00 AM - 7:30 AM"
              value={newSport.timing}
              onChange={(e) => setNewSport({ ...newSport, timing: e.target.value })}
            />
            {!validateTimingFormat(newSport.timing) && newSport.timing && (
              <span className="format-warning">Invalid format! Use "6:00 AM - 7:30 AM"</span>
            )}
            {checkTimeConflict(newSport.timing) && (
              <span className="conflict-warning">Time already used!</span>
            )}
          </div>

          <button 
            className="add-sport-btn" 
            onClick={handleAddSport}
            disabled={!newSport.name || !newSport.fees || !newSport.timing || 
                     !validateTimingFormat(newSport.timing) || checkTimeConflict(newSport.timing)}
          >
            Add Sport
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sportslist;
