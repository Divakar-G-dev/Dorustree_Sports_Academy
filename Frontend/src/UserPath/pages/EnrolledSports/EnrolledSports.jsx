import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import './EnrolledSports.css';

const EnrolledSports = () => {
  const { studentData } = useContext(UserContext);

  if (studentData.loading) return <div className="loading-container">Loading sports...</div>;
  if (!studentData.id) return <div className="loading-container">Loading sports...</div>;

  const totalFees = studentData.enrolledSports.reduce((sum, s) => sum + s.fees, 0);

  return (
    <div className="sports-page">
      <div className="sports-content">
        <h2 className="sports-title">My Enrolled Sports</h2>
        
        {studentData.enrolledSports.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-title">No sports enrolled</h3>
            <p className="empty-text">Visit Edit Sports to enroll in sports activities</p>
          </div>
        ) : (
          <div className="sports-table-container">
            <table className="sports-table">
              <thead>
                <tr className="table-header">
                  <th>Sport</th>
                  <th>Timing</th>
                  <th>Duration</th>
                  <th className="money-header">Monthly Fees</th>
                </tr>
              </thead>
              <tbody>
                {studentData.enrolledSports.map((sport) => (
                  <tr key={sport.id} className="table-row">
                    <td className="table-cell sport-name">{sport.name}</td>
                    <td className="table-cell">{sport.timing}</td>
                    <td className="table-cell">1 hr 30 mins</td>
                    <td className="table-cell money-cell">₹{sport.fees.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
                <tr className="table-total">
                  <td className="table-cell"><strong>Total:</strong></td>
                  <td className="table-cell"></td>
                  <td className="table-cell"></td>
                  <td className="table-cell total-fees">₹{totalFees.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledSports;
