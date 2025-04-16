import React, { useState } from "react";
import { Link } from "react-router-dom";
import InfoSteps from "./info";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-4 border-b shadow-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/images/app-logo.png"
            alt="YouNegotiate Logo"
            className="w-60"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800 focus:outline-none "
          >
            {isMobileMenuOpen ? (
              <span className="text-[38px]">&#x2715;</span> // Unicode for 'X' (close)
            ) : (
              <span className="text-[38px]">&#9776;</span> // Unicode for '☰' (hamburger)
            )}
          </button>
        </div>

        {/* Navigation Links and Buttons */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex items-center space-y-4 md:space-y-0 md:space-x-10 text-m md:text-sm font-medium transition-transform transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <a
            href="#"
            className="block px-2 py-2 text-blue-600 border-b-2 border-blue-600 md:border-none"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="block px-2 py-2 hover:text-blue-600 transition"
          >
            How it Works
          </a>
          <a
            href="#"
            className="block px-2 py-2 hover:text-blue-600 transition"
          >
            Creditor Network
          </a>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/login/consumer">
              <button
                className="px-8 py-3 border-2 border-blue-600  text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition"
                style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
              >
                I'm a Consumer
              </button>
            </Link>
            <Link to="/register/creditor">
              <button className="px-8 py-3 border-2 border-blue-600 bg-blue-600 text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
               >
                I'm a Creditor
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12">
        {/* Left Content */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Knock Out Delinquent <br /> Accounts Together... <br /> In Seconds!
          </h1>
          <p className="text-gray-600 text-lg">
            The first social platform for creditors, consumers, and donors to
            work together. Any time, Any Place.
          </p>
          <div className="flex space-x-4">
            <Link to="/login/consumer">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-800 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
              >
                I'm a Consumer
              </button>
            </Link>
            <Link to="/register/creditor">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-800 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
              >
                I'm a Creditor
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="mb-10 md:mb-0">
          <img
            src="/images/sd.png" // Replace with your own hero image
            alt="Hero"
            className="w-[350px] md:w-[450px]"
          />
        </div>
      </section>
      <InfoSteps/>
      {/* Footer */}
      <footer className="bg-gray-200 border-t mt-4 md:mt-0 py-6">
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

export default Home;
