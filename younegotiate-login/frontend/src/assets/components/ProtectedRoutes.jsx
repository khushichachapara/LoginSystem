import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loginTime = localStorage.getItem("loginTime");

  // Check if the user is logged in and if session has expired (30 minutes)
  if (!isLoggedIn || (Date.now() - loginTime > 30 * 60 * 1000)) {
    // Redirect to login page if not logged in or session has expired
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem('creditorId');
    return <Navigate to="/login/creditor" />;
  }

  return element;
};

export default ProtectedRoutes;
