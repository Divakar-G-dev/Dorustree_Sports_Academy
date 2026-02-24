import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const getInitialData = () => {
    try {
      const saved = sessionStorage.getItem('studentData');
      return saved ? JSON.parse(saved) : {
        id: null,
        email: "",
        profile: {
          firstName: "",
          lastName: "",
          phone: "",
          parentName: "",
          dob: "",
          emergencyContact: ""
        },
        enrolledSports: [],
        loading: false
      };
    } catch {
      return {
        id: null,
        email: "",
        profile: { firstName: "", lastName: "", phone: "", parentName: "", dob: "", emergencyContact: "" },
        enrolledSports: [],
        loading: false
      };
    }
  };

  const [studentData, setStudentData] = useState(getInitialData());

  const updateStudentData = (data) => {
    const newData = { ...studentData, ...data, loading: false };
    setStudentData(newData);
    sessionStorage.setItem('studentData', JSON.stringify(newData));
    console.log("Context updated:", newData); //  DEBUG
  };

  const clearStudentData = () => {
    setStudentData({
      id: null,
      email: "",
      profile: { firstName: "", lastName: "", phone: "", parentName: "", dob: "", emergencyContact: "" },
      enrolledSports: [],
      loading: false
    });
    sessionStorage.removeItem('studentData');
  };

  return (
    <UserContext.Provider value={{ 
      studentData, 
      updateStudentData, 
      clearStudentData 
    }}>
      {children}
    </UserContext.Provider>
  );
};
