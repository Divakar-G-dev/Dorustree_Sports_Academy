import React, { useEffect, useState } from "react";
import axios from "axios";
import "./sportslista.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Sportslist = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState({ name: "", fees: "", timing: "" });
  const [selectedSports, setSelectedSports] = useState([]);
  const [hoveredInput, setHoveredInput] = useState({ name: false, fees: false, timing: false });

  // Load sports from API
  const fetchSports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sports");
      const sportsArray = res.data.map((s) => ({ ...s, id: Number(s.id) }));
      setSports(sportsArray);
    } catch (err) {
      console.error("Error fetching sports:", err);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  // Timing format validation
  const validateTimingFormat = (timing) => {
    if (!timing) return false;
    const timePattern = /^((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM))\s*-\s*((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM))$/i;
    return timePattern.test(timing);
  };

  // Add sport
 const handleAddSport = async () => {
  if (!newSport.name || !newSport.fees || !newSport.timing) {
    toast.info("Fill all fields");
    return;
  }

  if (sports.some((s) => s.name.toLowerCase() === newSport.name.toLowerCase())) {
    toast.error("Sport already exists");
    return;
  }

  if (!validateTimingFormat(newSport.timing)) {
    toast.error(`Invalid timing format!\nUse format like: "6:00 AM - 7:30 AM"`);
    return;
  }

  const conflictingSport = sports.find((s) => s.timing === newSport.timing);
  if (conflictingSport) { 
    //  Fixed SweetAlert2 confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text:`Time ${newSport.timing} is already used by "${conflictingSport.name}". Do you still want to add "${newSport.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, add!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) return; // stop if user clicks Cancel
  }

  
  try {
    const res = await axios.post("http://localhost:8080/api/sports", newSport);
    setSports([...sports, { ...res.data, id: Number(res.data.id) }]);
    toast.success(`${newSport.name} added successfully!`);
    setNewSport({ name: "", fees: "", timing: "" });
  } catch (err) {
    console.error(err);
    toast.error("Failed to add sport");
  }
};

  // Delete sport
  const handleDeleteSport = async (id,name) => {

     const result = await Swal.fire({
      title: 'Are you sure?',
      text:`Do you want to delete ${name}?`,
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
      setSports((prevSports) => {
        const deletedSport = prevSports.find((s) => Number(s.id) === Number(id));

        if (deletedSport) {
          setSelectedSports((prevSelected) =>
            prevSelected.filter((name) => name !== deletedSport.name)
          );
        }
        return prevSports.filter((s) => Number(s.id) !== Number(id));
      });
      toast.success("Sport deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete sport");
    }
  };

  const sortedSports = [...sports].sort((a, b) => {
    const aSelected = selectedSports.includes(a.name);
    const bSelected = selectedSports.includes(b.name);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const conflictingSport = sports.find((s) => s.timing === newSport.timing);

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
              <td>{sport.name}</td>
              <td>1 hr 30 mins</td>
              <td><strong className="timing">{sport.timing}</strong></td>
              <td className="fees">₹{sport.fees.toLocaleString("en-IN")}</td>
              <td>
                <button
                  onClick={() => handleDeleteSport(sport.id,sport.name)}
                  className="delete-btn"
                >
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

          {/* Name */}
          <div 
            className="form-group tooltip-container"
            onMouseEnter={() => setHoveredInput({ ...hoveredInput, name: true })}
            onMouseLeave={() => setHoveredInput({ ...hoveredInput, name: false })}
          >
            <label>Sport Name</label>
            <input
              type="text"
              placeholder="e.g., Cricket"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
            />
            {hoveredInput.name && !newSport.name && (
              <span className="tooltip-text">Enter the sport name</span>
            )}
          </div>

          {/* Fees */}
          <div 
            className="form-group tooltip-container"
            onMouseEnter={() => setHoveredInput({ ...hoveredInput, fees: true })}
            onMouseLeave={() => setHoveredInput({ ...hoveredInput, fees: false })}
          >
            <label>Monthly Fees</label>
            <input
              type="number"
              placeholder="e.g., 1500"
              value={newSport.fees}
              onChange={(e) => setNewSport({ ...newSport, fees: e.target.value })}
            />
            {hoveredInput.fees && !newSport.fees && (
              <span className="tooltip-text">Enter monthly fees in ₹</span>
            )}
          </div>

          {/* Timing */}
          <div 
            className="form-group tooltip-container"
            onMouseEnter={() => setHoveredInput({ ...hoveredInput, timing: true })}
            onMouseLeave={() => setHoveredInput({ ...hoveredInput, timing: false })}
          >
            <label>Timing</label>
            <input
              type="text"
              placeholder="e.g., 6:00 AM - 7:30 AM"
              value={newSport.timing}
              onChange={(e) => setNewSport({ ...newSport, timing: e.target.value })}
            />
            {hoveredInput.timing && !newSport.timing && (
              <h4 className="tooltip-text">
               ** Format: "6:00 AM - 7:30 AM", <h4 style={{fontWeight:"100",textAlign:"center"}}>Duration: 1 hr 30 mins</h4>
              </h4>
            )}

            {/* Warnings */}
            {!validateTimingFormat(newSport.timing) && newSport.timing && (
              <span className="format-warning">
                Invalid format! Use "6:00 AM - 7:30 AM"
              </span>
            )}
          </div>

          {/* Add Button */}
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