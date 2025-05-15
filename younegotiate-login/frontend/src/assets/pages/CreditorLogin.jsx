import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useFormik } from "formik";
import * as yup from "yup";
import { Bounce, ToastContainer, toast } from 'react-toastify';




const CreditorLogin = () => {


  const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const navigate = useNavigate();
  const er = document.getElementById("er");



  const handleSubmit = async (value) => {


    const { email, password } = value;

    //console.log("Form values:", value); // Log the form values


    if (!email || !password) {
      formik.setErrors({
        email: "Email is required",
        password: "Password is required",
      });
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

      console.log(response)

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem('creditorId',response.data.user.id);
      
      toast.info("Login successfully!");
      console.log("Logged in user:", response.data.user);
      navigate("/creditor/dashboard");
    } catch (error) {
      console.log(error);
      formik.setErrors({
        email:error.response?.data?.message,
        password:error.response?.data?.message,

      });
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
              className="md:w-60 w-40 "
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/login/consumer">
            <button
              className="md:px-6 px-0.5 py-3 border-2 border-blue-500  text-blue-600 rounded-lg font-semibold hover:bg-blue-50  transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }}
            >
              🔒 Consumer Login
            </button>
          </Link>
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-blue-500">Member Login</h2>
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Registered email"
              onChange={formik.handleChange}
              value={formik.values.email}
              // value={form.email}
              // onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.email && Boolean(formik.errors.email) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.email}</label>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              // value={form.password}
              // maxLength={16}
              // onChange={handleChange}
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.password && Boolean(formik.errors.password) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.password}</label>
            )}</div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register/creditor"
              className="text-blue-500 hover:underline"
            >
              Join Now🤝
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
