import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const CreditorRegister = () => {

  const validationSchema = yup.object({
    name: yup.string("Enter your name").required("Name is required"),
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: yup
      .string("Confirm your password")
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });


  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const navigate = useNavigate();

  const handleSubmit = async (value) => {

    const { name, email, password, confirmPassword } = value;
    //console.log("Form values:", value); // Log the form values

    if (!name || !email || !password || !confirmPassword) {
      formik.setErrors({
        name: "Name is required",
        email: "Email is required",
        password: "Password is required",
        confirmPassword: "Confirm Password is required",
      });
    }

    if (password !== confirmPassword) {
      formik.setErrors({
        password: "Passwords do not match",
        confirmPassword: "Passwords do not match",
      });


    }
    if (password.length < 8) {
      formik.setErrors({
        password: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/creditor/register",
        {
          name,
          email,
          password,
          confirmPassword

        }
      );

      toast.info("Registration successful!");
      //console.log("Registration successful:", res.data);

      navigate("/login/creditor");

      formik.resetForm();

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Server Error:", err.response.data.message);
        toast.error('User with this Email already exists');
      } else {
        console.log("Unexpected Error:", err.message); // network issue, etc.
      }
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
              className="px-8 py-3 border-2 border-blue-500  text-blue-600 rounded-lg font-semibold hover:bg-blue-50  transition"
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
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
            Join the Win-Win Team
          </h2>

          <div className="mb-4">

            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="UserName"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            /> {formik.touched.name && Boolean(formik.errors.name) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.name}</label>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.email && Boolean(formik.errors.email) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.email}</label>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.password && Boolean(formik.errors.password) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.password}</label>
            )}


            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              maxLength={16}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.confirmPassword}</label>
            )}

          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-sm mt-4 text-center text-gray-600">
            Already registered?
            <Link
              to="/login/creditor"
              className="text-blue-500 hover:underline ml-1"
            >
              Login here
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

export default CreditorRegister;
