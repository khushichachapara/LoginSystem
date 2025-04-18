import React from "react";
import { Link, useNavigate } from "react-router-dom";


const CreditorDashboard = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    // Clear the login status from localStorage
    localStorage.removeItem("isLoggedIn");
    //localStorage.removeItem("token"); // Clear the token if you stored it
    navigate("/"); // Redirect to home or login
  };


  return (
    <>
      <div class="flex h-screen bg-gray-100">
        <aside class="lg:w-1/5 bg-gray-200 border border-gray-400 m-4 overflow-y-auto">
          <Link to="/">
            <img
              src="/images/app-logo.svg"
              alt="YouNegotiate Logo"
              class=" h-40 mx-auto "
            />
          </Link>

          <nav class="flex-col space-y-4 flex items-center">
            <Link
              to="/creditor/dashboard"
              class="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/paymentTerms"
              class="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              Set Payment Terms
            </Link>
            <Link
              to="/CreateConsumer"
              class="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              Create Consumer
            </Link>
          </nav>
          <div class="flex align justify-center  mt-20">
            <button 
            onClick={handleLogout}
            class="bg-blue-500 border border-blue-500 text-white px-8 py-2 tracking-widest rounded-lg hover:bg-blue-50 hover:text-blue-500 transition duration-300">
              Logout
            </button>
          </div>
        </aside>

        <main class="flex-1 flex flex-col justify-between p-6">
          <div class="flex-1 overflow-y-auto space-y-4 mb-4 mt-8">
            <h1 class="text-2xl font-bold text-gray-800">creditor deshboard</h1>
            <p class="text-gray-600">
              Welcome to your dashboard! Here you can manage your payment terms,
              view consumer details, and more.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};
export default CreditorDashboard;
