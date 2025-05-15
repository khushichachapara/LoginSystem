import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfoSteps from "./info";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreditorClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/creditor/dashboard");
    } else {
      navigate("/login/creditor");
    }
  };

  const handleConsumerClick = () => {
    const consumerId =localStorage.getItem('consumerId')
    const isLoggedIn = localStorage.getItem("isLoggedInconsumer");
    if (isLoggedIn === "true") {
      navigate(`/consumer/dashboard/${consumerId}`);
    } else {
      navigate("/login/consumer");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-4 border-b shadow-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2 hover:pointer">
          <Link to="/">
            <img
              src="/images/app-logo.png"
              alt="YouNegotiate Logo"
              className="w-60"
            />
          </Link>
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
          className={`md:static absolute top-16 left-0 p-10 w-full h-auto md:h-auto md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none md:p-0 md:flex items-center space-y-4 md:space-y-0 md:space-x-10 text-m md:text-sm font-medium transition-all duration-300 ease-in-out z-50  ${
            isMobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible md:opacity-100 md:visible"
          } md:translate-x-0`}
        >
          <a
            href="#"
            className="block px-2 py-2 text-blue-600  border-blue-600 md:border-none"
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
            <button
              onClick={handleConsumerClick}
              className="px-8 py-3 w-fit border-2 border-blue-500  text-blue-600 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Consumer
            </button>

            <button
              onClick={handleCreditorClick}
              className="px-8 py-3 border-2 w-fit border-blue-500 bg-blue-500 text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Creditor
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12">
        {/* Left Content */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold leading-none">
            Knock Out Delinquent <br /> Accounts Together... <br />
            <span className="text-blue-500"> In Seconds!</span>
          </h1>
          <p className="text-black text-xl leading-none">
            The first social platform for creditors, consumers, and <br />
            donors to work together. Any time, Any Place.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleConsumerClick}
              className="px-5 py-2 bg-blue-500 text-white rounded-full font-semibold shadow-md hover:pointer transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Consumer
            </button>

            <button
              onClick={handleCreditorClick}
              className="px-5 py-2 bg-blue-500 text-white rounded-full font-semibold shadow-md hover:pointer transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Creditor
            </button>
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
      <InfoSteps />
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
