import React, { useEffect } from "react"; 
import "./student.css";

const StudentList = ({ students = [], showTotalFees = false }) => {
  const filteredStudents = students.filter(student => student.role === "Student");
   

  return (
    <table className="student-table">  
      <thead>
        <tr>
          <th>S.No</th>
          <th>Name</th>
          <th>Phone Num</th>
          <th>Enrolled Sports</th>
          {showTotalFees && <th>Total Fees (₹)</th>}
        </tr>
      </thead>
      <tbody>
        {filteredStudents.length === 0 ? (
          <tr>
            <td colSpan={showTotalFees ? 5 : 4} className="no-data">
            No students enrolled
          </td>
        </tr>
        ) : (
          filteredStudents.map((student, index) => {
            const totalFees = student.totalFees || 
              (student.sports?.reduce((sum, s) => sum + (s.fees || 0), 0) || 0);
            const sportsNames = student.sports?.map(s => s.name).join(", ") || "—";
            
            return (
              <tr key={student.studentId || index}>
                <td>{index + 1}</td>
                <td className="student-name">{`${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A'}</td>
                <td className="phone-num">{student.phone || 'N/A'}</td>
                <td className="sports-names">{sportsNames}</td>
                {showTotalFees && <td className="total-fees">₹{totalFees.toLocaleString("en-IN")}</td>}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default StudentList;
