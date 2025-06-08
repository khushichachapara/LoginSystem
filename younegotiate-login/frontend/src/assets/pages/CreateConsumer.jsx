import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";


const CreateConsumer = () => {
  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    dob: Yup.date().required("Date of birth is required"),
    ssn: Yup.string()
      .matches(/^\d{4}$/, "SSN must be 4 digits")
      .required("SSN is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    balance: Yup.number()
      .required("Balance is required")
      .positive("Balance must be a positive number"),
    accountnumber: Yup.string()
      .matches(/^\d{12}$/, "Account number must be 12 digits")
      .required("Account number is required"),
    mobilenumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
  });



  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      firstname: "",
      lastname: "",
      dob: "",
      ssn: "",
      email: "",
      balance: "",
      accountnumber: "",
      mobilenumber: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
 

  const handleSubmit = async (value) => {
    //event.preventDefault();
    //const ptag = document.getElementById("ptag");

    // Get form values
    const {
      firstname,
      lastname,
      dob,
      ssn,
      email,
      balance,
      accountnumber,
      mobilenumber,
    } = value;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in.");
        return;
      }

      //console.log("Token being sent:", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/create_consumer/create",
        {
          firstname,
          lastname,
          dob,
          email,
          ssn,
          mobilenumber,
          balance: parseFloat(balance),
          accountnumber: accountnumber.trim(),
        },
        config
      );
      console.log("Consumer created successfully:", response.data);
      toast.info("Consumer created successfully!");

      formik.resetForm();

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        console.log("Server Error:", err.response.data.error);
        toast.error('User with this Email and Other Details already exists ');
      } else {
        console.log("Unexpected Error:", err); 
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 relative">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full min-h-[600px] m-3 max-w-8xl ">
        <h2 className="text-4xl  mb-6 text-center text-blue-500 ">
          New Consumer
        </h2>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {/* firstnamefield */}
            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="firstname"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              placeholder="consumer's first name"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              autoComplete="off"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {formik.touched.firstname && Boolean(formik.errors.firstname) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.firstname}</label>
            )}


          </div>

          <div>
            {/* latnamefield */}
            <label
              className="block text-gray-700 text-lg font-bold  mt-2 mb-2"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              placeholder="consumer's last name"
              autoComplete="off"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />{formik.touched.lastname && Boolean(formik.errors.lastname) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.lastname}</label>

            )}

          </div>

          <div>
            {/* dateofbirthfield */}
            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="dob"
            >
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              id="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              placeholder="consumer's date of birth"
              className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />{formik.touched.dob && Boolean(formik.errors.dob) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.dob}</label>
            )}

          </div>

          <div>
            {/* Email */}
            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="email"
            >
              {" "}
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="consumer's email"
              autoComplete="off"
              inputMode="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />{formik.touched.email && Boolean(formik.errors.email) && (
              <label className='text-red-500 text-sm m-2'>{formik.errors.email}</label>
            )}

          </div>

          <div>
            {/* ssn-number */}

            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="ssn"
            >
              Last 4 Digits of SSN
            </label>
            <input
              type="text"
              id="ssn"
              value={formik.values.ssn}
              onChange={formik.handleChange}
              placeholder="consumer's ssn number last four degits"
              className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              maxLength={4}
              autoComplete="off"
              pattern="\d{4}"
              inputMode="numeric"
            />{formik.touched.ssn && Boolean(formik.errors.ssn) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.ssn}</label>
            )}

          </div>

          <div>
            {/* balancefield */}
            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="Balance"
            >
              {" "}
              Outstanding Loan Balance (₹)
            </label>
            <input
              type="number"
              id="balance"
              value={formik.values.balance}
              onChange={formik.handleChange}
              placeholder="consumer's balance"
              className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />{formik.touched.balance && Boolean(formik.errors.balance) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.balance}</label>
            )}

          </div>

          <div>
            {/* Accountnumberfeild */}
            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="AccountNumber"
            >
              {" "}
              12-Digit Account Number
            </label>
            <input
              type="text"
              maxLength={12}
              value={formik.values.accountnumber}
              onChange={formik.handleChange}
              autoComplete="off"
              id="accountnumber"
              placeholder="consumer's account number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />{formik.touched.accountnumber && Boolean(formik.errors.accountnumber) && (
              <label className="text-red-500 text-sm m-2">{formik.errors.accountnumber}</label>
            )}

          </div>

          <div>
            {/* MobileNumber */}

            <label
              className="block text-gray-700 text-lg font-bold mb-2 mt-2"
              htmlFor="MobileNumber"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="mobilenumber"
              placeholder="consumer's mobile number"
              maxLength={10}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.mobilenumber}
              pattern="\d{10}"
              inputMode="numeric"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
              required
            />{formik.touched.mobilenumber && Boolean(formik.errors.mobilenumber) && (
              <label className="text-red-500 text-sm">{formik.errors.mobilenumber}</label>
            )}


          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-4 mb-10"></div>

      </form>

      {/* Action Buttons */}
      <div className="absolute bottom-8 right-6 flex gap-4 mr-6 ">
        <Link to="/creditor/dashboard">
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400  border border-gray-700 text-gray-800 font-medium  "
          >
            Back to Dashbord
          </button>
        </Link>
        <button
          onClick={formik.handleSubmit}
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-50 text-white font-medium border border-blue-500 hover:text-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateConsumer;
