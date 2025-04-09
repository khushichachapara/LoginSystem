import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-4 border-b shadow-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/images/app-logo.png" alt="YouNegotiate Logo" className="h-8" />
        </div>

        {/* Navigation Links */}
        <div className=" hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">
            Home
          </a>
          <a href="#" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#" className="hover:text-blue-600 transition">Creditor Network</a>
        </div>

        {/* Buttons */}
        <div className=" md:flex space-x-4">
          <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition">
            I'm a Consumer
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
            I'm a Creditor
          </button>
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
            The first social platform for creditors, consumers, and donators to work together. Any time, Any Place.
          </p>
          <div className="flex space-x-4">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition">
              I'm a Consumer
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition">
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
    </div>
  );
};


export default Home;
