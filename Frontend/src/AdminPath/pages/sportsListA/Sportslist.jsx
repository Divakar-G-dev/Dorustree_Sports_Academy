import React, { useEffect, useState } from "react";
import axios from "axios";
import "./sportslista.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Sportslist = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState({ name: "", fees: "", timing: "" });

  // Fetch sports from API
  const fetchSports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sports");
      setSports(res.data.map(s => ({ ...s, id: Number(s.id) })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  // Timing validation
  const validateTimingFormat = (timing) => {
    const timePattern = /^((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM))\s*-\s*((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM))$/i;
    return timePattern.test(timing);
  };

  // Add sport
  const handleAddSport = async () => {
    if (!newSport.name || !newSport.fees || !newSport.timing) {
      toast.info("Fill all fields");
      return;
    }

    if (!validateTimingFormat(newSport.timing)) {
      toast.error("Invalid timing format! Use e.g., 6:00 AM - 7:30 AM");
      return;
    }

    const conflictingSport = sports.find(s => s.timing === newSport.timing);
    if (conflictingSport) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Time ${newSport.timing} is already used by "${conflictingSport.name}". Add anyway?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'No'
      });
      if (!result.isConfirmed) return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/sports", newSport);
      setSports([...sports, { ...res.data, id: Number(res.data.id) }]);
      toast.success(`${newSport.name} added successfully!`);
      setNewSport({ name: "", fees: "", timing: "" });
    } catch (err) {
      toast.error("Failed to add sport");
    }
  };

  // Delete sport
  const handleDeleteSport = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/sports/${id}`);
      setSports(prev => prev.filter(s => s.id !== id));
      toast.success("Sport deleted successfully!");
    } catch {
      toast.error("Failed to delete sport");
    }
  };

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
          {sports.map(sport => (
            <tr key={sport.id}>
              <td>{sport.name}</td>
              <td>1 hr 30 mins</td>
              <td>{sport.timing}</td>
              <td>₹{sport.fees.toLocaleString("en-IN")}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDeleteSport(sport.id, sport.name)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Sport Form */}
      <div className="add-sport-container">
        <h3>Add New Sport</h3>
        <div className="add-sport-form">
          <div className="form-group">
            <label>Sport Name</label>
            <input
              type="text"
              placeholder="e.g., Cricket"
              value={newSport.name}
              onChange={e => setNewSport({ ...newSport, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Monthly Fees</label>
            <input
              type="number"
              placeholder="e.g., 1500"
              value={newSport.fees}
              onChange={e => setNewSport({ ...newSport, fees: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Timing</label>
            <input
              type="text"
              placeholder="6:00 AM - 7:30 AM"
              value={newSport.timing}
              onChange={e => setNewSport({ ...newSport, timing: e.target.value })}
              pattern="^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s*-\s*(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
              title='Please follow the format "6:00 AM - 7:30 AM"'
              required
            />
            <div className="format-warning">
              {!validateTimingFormat(newSport.timing) && newSport.timing
                ? 'Invalid format! Use "6:00 AM - 7:30 AM"' : '\u00A0'}
            </div>
          </div>

          <button
            className="add-sport-btn"
            onClick={handleAddSport}
            disabled={!newSport.name || !newSport.fees || !newSport.timing || !validateTimingFormat(newSport.timing)}
          >
            Add Sport
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sportslist;
