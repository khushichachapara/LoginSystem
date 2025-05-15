import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutesConsumer = ({ element }) => {
  const isLoggedInconsumer = localStorage.getItem("isLoggedInconsumer");
  const loginTimeconsumer = localStorage.getItem("loginTimeconsumer");

  // Check if the user is logged in and if session has expired (30minutes)
  if (!isLoggedInconsumer || (Date.now() - loginTimeconsumer > 30 * 60 * 1000)) {
    // Redirect to login page if not logged in or session has expired
    localStorage.removeItem("isLoggedInconsumer");
    localStorage.removeItem("tokenconsumer");
    localStorage.removeItem("consumerId");
    localStorage.removeItem("loginTimeconsumer");
    return <Navigate to="/login/consumer" />;
  }


  return element;
};

export default ProtectedRoutesConsumer;
