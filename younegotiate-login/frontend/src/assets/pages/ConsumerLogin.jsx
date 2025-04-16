import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import React from "react";

const ConsumerLogin = () => {
  return (
    <div>
      {/* navbar */}
      <nav className=" flex items-center justify-between px-6 md:px-20 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src="/images/app-logo.png"
              alt="YouNegotiate Logo"
              className="w-60"
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/register/creditor">
            <button
              className="px-8 py-3 border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-full font-semibold bg-white text-blue-600 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Creditor
            </button>
          </Link>
        </div>
      </nav>

      {/* mainform */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Consumer Login</h2>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <input
            type="text"
            name="ssn"
            maxLength={4}
            inputMode="numeric"
            pattern="\d{4}"
            placeholder="SSN last 4 digits"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <p className="font-semibold text-xl">
              YouNegotiate offers you free service to resolve your debt without
              speaking with a collector.
            </p>
          </div>
        </form>
      </div>

      {/* footer */}
      <footer className="bg-gray-200 border-t mt-0 md:mt-0 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          <div>
            <img
              src="/images/app-logo.png"
              alt="YouNegotiate Logo"
              className=" w-40  inline-block"
            />
            <p className="text-gray-500 text-m mt-2">
              © {new Date().getFullYear()} YouNegotiate. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 text-m text-gray-600">
            <a href="#" className="hover:text-blue-600">
              About
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
            <a href="#" className="hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default ConsumerLogin;
