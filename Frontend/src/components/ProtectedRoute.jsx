import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const studentData = sessionStorage.getItem('studentData');
    const token = sessionStorage.getItem('authToken');

    if (!studentData || !token) {
      setIsAllowed(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(studentData);
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } catch {
      setIsAllowed(false);
    }
    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;

  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
}
