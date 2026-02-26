import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentList from "../studentList/StudentList.jsx";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [allSports, setAllSports] = useState([]);
  const [collectedSummary, setCollectedSummary] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const resStudents = await axios.get("http://localhost:8080/api/students");
        const studentsData = resStudents.data;
        setStudents(studentsData);

        const resSports = await axios.get("http://localhost:8080/api/students/all-sports");
        const sportsData = resSports.data;
        setAllSports(sportsData);

        const feesPerSport = {};
        studentsData.forEach((student) => {
          if (student.role === "Student" && student.sports) {
            student.sports.forEach((sport) => {
              feesPerSport[sport.name] = (feesPerSport[sport.name] || 0) + sport.fees;
            });
          }
        });
        setCollectedSummary(feesPerSport);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const studentOnlyCount = students.filter(student => student.role === "Student").length;
  const top5Students = students.filter(student => student.role === "Student").slice(0, 5);

  const chartArray = Object.entries(collectedSummary).map(([name, value]) => ({ //setCollected(feespersport {*is a object8}) covert to object
    name,
    value,
  }));

  const COLORS = ["#4171c9", "#63c933", "#e99312", "#ff4d4d", "#9c27b0", "#00bcd4"];
  const totalCollected = Object.values(collectedSummary).reduce((sum, val) => sum + val, 0, 0);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="grid">
        <div className="box">
          <div className="box-left" style={{ backgroundColor: "#4171c9" }}>
            {studentOnlyCount}
          </div>
          <div className="box-right">
            <h2>Total Students</h2>
          </div>
        </div>

        <div className="box">
          <div className="box-left" style={{ backgroundColor: "#63c933" }}>
            {allSports.length}
          </div>
          <div className="box-right">
            <h2>Total Sports</h2>
          </div>
        </div>

        <div className="box">
          <div className="box-left" style={{ backgroundColor: "#e99312" }}>
            {students
              .filter(s => s.role === "Student")
              .reduce((count, s) => count + (s.sports?.length || 0), 0)}
          </div>
          <div className="box-right">
            <h2>Enrolled Sports</h2>
          </div>
        </div>

        <div className="box">
          <div className="box-left" style={{ backgroundColor: "#ff4d4d" }}>
            {totalCollected.toLocaleString("en-IN")}
          </div>
          <div className="box-right">
            <h2>Total Revenue Per Month (₹)</h2>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="leftdash">
          <h2 className="dash-section-title">Enrolled Students</h2>
          <div className="dashboard-student-table"> 
            <StudentList students={top5Students} showTotalFees={true} />
          </div>
          <div className="view-all-btn">
            <button onClick={() => navigate("/students")}>
              View All
            </button>
          </div>
        </div>

        <div className="rightdash">
          {chartArray.length > 0 ? (
            <>
              <h3 className="dash-section-title">Monthly Fees Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartArray}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    label
                  >
                    {chartArray.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <h3 className="total-fees-title">
                Total Fees Collected: ₹{totalCollected.toLocaleString("en-IN")}
              </h3>
              <table className="fees-table">
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th className="cfees">Collected Fees (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartArray.map((item, index) => (
                    <tr key={item.name}>
                      <td>
                        <span
                          className="color-box"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {item.name}
                      </td>
                      <td className="cfees">₹{item.value.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No fee data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
