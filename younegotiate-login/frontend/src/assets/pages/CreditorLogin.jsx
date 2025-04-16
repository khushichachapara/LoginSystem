import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreditorLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = form;

    console.log("Submitting form:", form);

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/creditor/login",
        {
          email,
          password,
        }
      );

      alert("Login successful!");
      console.log("Logged in user:", response.data.user);

      navigate("/creditor/deshbord");
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

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
          <Link to="/login/consumer">
            <button
              className="px-8 py-3 border-2 border-blue-600  text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              I'm a Consumer
            </button>
          </Link>
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Creditor Login</h2>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Registered email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register/creditor"
              className="text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
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

export default CreditorLogin;
