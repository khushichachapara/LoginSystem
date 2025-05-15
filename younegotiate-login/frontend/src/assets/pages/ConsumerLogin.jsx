import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const ConsumerLogin = () => {
  // const [form, setForm] = useState({
  //   lastname: "",
  //   dob: "",
  //   ssn: "",
  //});

  const validationSchema = Yup.object({
    lastname: Yup
      .string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    dob: Yup
      .date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    ssn: Yup
      .string()
      .required("SSN is required")
      .matches(/^\d{4}$/, "SSN must be exactly 4 digits"),
  });
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      lastname: "",
      dob: "",
      ssn: "",
    },
    onSubmit: (values) => {

      handleSubmit(values);
    },
  });

  // const er = document.getElementById("er");
  const navigate = useNavigate();
  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  //   er.innerHTML = ""; // Clear error message on input change
  //};

  const handleSubmit = async (value) => {
    ///e.preventDefault();

    const { lastname, dob, ssn } = value;
    console.log('submitting form:', value);

    try {
      const response = await axios.post
        ("http://localhost:5000/api/create_consumer/consumerlogin",
          {
            lastname,
            dob,
            ssn
          });



      localStorage.setItem("isLoggedInconsumer", "true");
      localStorage.setItem("tokenconsumer", response.data.token);
      localStorage.setItem('consumerId', response.data.consumerId);
      localStorage.setItem("loginTimeconsumer", Date.now().toString());
      //console.log("Token:", token);

      console.log("Consumer ID:", response.data.consumerId);
      toast.info("Login successfully!");
      console.log("Logged in user:", response.data.user);
      navigate(`/consumer/dashboard/${response.data.consumerId}`); // Redirect to the dashboard or another page



    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Server Error:", err.response.data.message);
        toast.error('Invalid Credentials Or Consumer');
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
              className="md:w-60 w-40"
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/login/creditor">
            <button
              className="md:px-6 px-0.5 py-3 border-2 border-blue-500 hover:bg-blue-50  rounded-lg font-semibold bg-white text-blue-600 transition"
              style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }} // blue shadow
            >
              🔒 Creditor Login
            </button>
          </Link>
        </div>
      </nav>

      {/* mainform */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-blue-500 ">Consumer Portal Login </h2>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="lastname"
              placeholder="LastName"
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.lastname}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.lastname && Boolean(formik.errors.lastname) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.lastname}</label>
            )}
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              onChange={formik.handleChange}
              value={formik.values.dob}
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.dob && Boolean(formik.errors.dob) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.dob}</label>
            )}

            <input
              type="text"
              name="ssn"
              maxLength={4}
              inputMode="numeric"
              autoComplete="off"
              pattern="\d{4}"
              onChange={formik.handleChange}
              value={formik.values.ssn}
              placeholder="SSN last 4 digits"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            />
            {formik.touched.ssn && Boolean(formik.errors.ssn) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.ssn}</label>
            )}</div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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
