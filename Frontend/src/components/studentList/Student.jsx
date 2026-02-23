import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentList from "./StudentList.jsx";  // ✅ FIXED .jsx

import "./student.css";

function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/students");
        const data = res.data;
        console.log("Fetched students:", data);
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading students...</div>;
  }

  return (
    <div style={{ padding: "20px" }}> 
      <h2 style={{textAlign:"center",marginBottom:"20px"}}>All Enrolled Students</h2>
      <StudentList students={students} showTotalFees={true} />
    </div>
  );
}

export default Student;
