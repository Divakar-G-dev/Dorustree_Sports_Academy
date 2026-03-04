import React, { useEffect, useState } from "react";
import axios from "axios";
import "./enrollsports.css";
import { toast } from "react-toastify";

function EnrollSports({ setStudents }) {
  const [sportsList, setSportsList] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "", 
    phone: "",
    parentName: "",
    emergencyContact: "",
    dob: "",
    password: "",
    confirmPassword: "",
    sports: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/students/all-sports")
      .then(res => {
        setSportsList(res.data.map(s => ({
          id: s.id,
          name: s.name,
          fees: s.fees,
          timing: s.timing
        })));
      })
      .catch(err => console.log("Failed to fetch sports:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const normalizeTiming = (timing) => {
    if (!timing) return "";
    return timing.toLowerCase()
      .replace(/\./g, ':')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleSportChange = (sportId) => {
    const sport = sportsList.find(s => s.id === sportId);
    if (!sport) return;

    if (form.sports.includes(sportId)) {
      setForm(prev => ({
        ...prev,
        sports: prev.sports.filter(id => id !== sportId)
      }));
      setErrors({ ...errors, sports: "" });
      return;
    }

    const selectedSports = form.sports
      .map(id => sportsList.find(s => s.id === id))
      .filter(Boolean);

    const conflict = selectedSports.find(s => normalizeTiming(s.timing) === normalizeTiming(sport.timing));

    if (conflict) {
      toast.error(
  `"${sport.name}" cannot be selected. Time slot (${sport.timing}) is taken by "${conflict.name}".`,
  { autoClose: 5000, pauseOnHover: true }
);
      return;
    }

    setForm(prev => ({
      ...prev,
      sports: [...prev.sports, sportId]
    }));
    setErrors({ ...errors, sports: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName || form.firstName.length < 3) newErrors.firstName = "First name must be at least 3 characters.";
    if (!form.lastName || form.lastName.length < 1) newErrors.lastName = "Last name must be at least 1 character.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "A valid email is required.";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits.";
    if (!form.parentName) newErrors.parentName = "Parent name is required.";
    if (!form.emergencyContact || !/^\d{10}$/.test(form.emergencyContact)) newErrors.emergencyContact = "Emergency contact must be 10 digits.";
    if (!form.dob) newErrors.dob = "DOB is required.";
    if (form.dob && new Date(form.dob) >= new Date()) newErrors.dob = "DOB must be in the past.";
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (form.sports.length === 0) newErrors.sports = "Select at least one sport.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warning("Please fix the highlighted fields before submitting.");
      return;
    }

    try {
      const payload = { ...form, sportIds: form.sports };
      await axios.post("http://localhost:8080/api/students/register", payload);
      toast.success("✅ Registration Successful!");

      const res = await axios.get("http://localhost:8080/api/students");
      setStudents(res.data);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        parentName: "",
        emergencyContact: "",
        dob: "",
        password: "",
        confirmPassword: "",
        sports: [],
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        toast.error("Registration failed. Check highlighted fields.");
      } else toast.error("⚠ Something went wrong. Please try again.");
    }
  };

  const totalFees = sportsList
    .filter(s => form.sports.includes(s.id))
    .reduce((sum, s) => sum + s.fees, 0);

  return (
    <div className="student-page-container">
      <form className="student-form-container" onSubmit={handleSubmit}>
        <h1>Enrollment Form</h1>

        {/* Name */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name*</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={errors.firstName ? "error-input" : ""} />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={errors.lastName ? "error-input" : ""} />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
        </div>

        {/* Email*/}
        <div className="form-row">
          <div className="form-group">
            <label>Email*</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={errors.email ? "error-input" : ""} 
              style={{ width:"100%", padding:"12px 16px", fontSize:"16px", border:"2px solid #e5e7eb", borderRadius:"8px", background:"#fafbfc" }} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        { /* DOB, Phone */} 
           <div className="form-row">
          <div className="form-group">
            <label>DOB*</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className={errors.dob ? "error-input" : ""} />
            {errors.dob && <span className="error-text">{errors.dob}</span>}
          </div>
          <div className="form-group">
            <label>Phone*</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={errors.phone ? "error-input" : ""} />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        {/* Parent & Emergency */}
        <div className="form-row">
          <div className="form-group">
            <label>Parent Name*</label>
            <input type="text" name="parentName" value={form.parentName} onChange={handleChange} className={errors.parentName ? "error-input" : ""} />
            {errors.parentName && <span className="error-text">{errors.parentName}</span>}
          </div>
          <div className="form-group">
            <label>Emergency Contact*</label>
            <input type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className={errors.emergencyContact ? "error-input" : ""} />
            {errors.emergencyContact && <span className="error-text">{errors.emergencyContact}</span>}
          </div>
        </div>

        {/* Password */}
        <div className="form-row">
          <div className="form-group">
            <label>Password*</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className={errors.password ? "error-input" : ""} />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password*</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "error-input" : ""} />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
        </div>

        {/* Sports */}
        <div className="form-group">
          <label>Select Sports* (One per time slot only)</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", marginTop:"4px" }}>
            {sportsList.map(sport => (
              <label key={sport.id} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <input 
                  type="checkbox" 
                  checked={form.sports.includes(sport.id)} 
                  onChange={() => handleSportChange(sport.id)} 
                />
                {sport.name} (₹{sport.fees.toLocaleString("en-IN")})
              </label>
            ))}
          </div>
          {errors.sports && <span className="error-text">{errors.sports}</span>}
        </div>

        {/* Total Fees */}
        {form.sports.length > 0 && (
          <div style={{ marginTop:"10px", fontWeight:"bold", textAlign:"center" }}>
            Total Fees: ₹{totalFees.toLocaleString("en-IN")}
          </div>
        )}

        <button type="submit" className="reg-btn">Register</button>
      </form>
    </div>
  );
}

export default EnrollSports;