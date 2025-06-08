import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoPersonAddOutline } from "react-icons/io5";
import { CiSquareInfo } from "react-icons/ci";
import { RiMenu2Fill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";

const CreditorDashboard = () => {
 
  //color generator function
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const getColorBrightness = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    // Formula to calculate brightness of the color
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [consumers, setConsumers] = useState([]);

  const handleLogout = () => {
    // Clear the login status from localStorage

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime"); 
    localStorage.removeItem('creditorId');
    toast.info('succesfully logged out!!');
    navigate("/login/creditor"); // Redirect to home or login
  };

  // Fetch consumers from the backend
  useEffect(() => {
    const fetchConsumers = async () => {
      const token = localStorage.getItem("token"); // Get the JWT token from localStorage

      // Make an API request to get consumers associated with the logged-in creditor
      try {
        const response = await axios.get(
          "http://localhost:5000/api/create_consumer/getConsumers",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
        setConsumers(response.data.consumers); // Set the fetched consumers to state
      } catch (error) {
        console.error("Error fetching consumers:", error);
      }
    };

    fetchConsumers();
  }, [])

  return (
    <>
      <div className="flex h-screen bg-gray-100 ">
        {/* hamburgur */}

        <button
          className="absolute top-5 left-8 lg:hidden p-2 bg-blue-200 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <RiMenu2Fill  style={{color:'blue', fontSize:'25px'}}/>

        </button>

        {/* sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gray-200 border border-gray-400 overflow-y-auto transform  z-50 ${
            sidebarOpen ? "translate-x-0"  : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-1/5 lg:m-0 `}
        >
          <div className="relative">
            
              <img
                src="/images/app-logo.svg"
                alt="YouNegotiate Logo"
                className="h-40 mx-auto"
              />
            
            {/* Close button inside sidebar (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-4 lg:hidden text-2xl font-bold text-blue-500"
            >
              <RiCloseFill style={{fontSize:'50px'}}/>
            </button>
          </div>

          <nav className="flex-col space-y-4 flex items-center">
            <Link
              to="/creditor/dashboard"
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
               Overview
            </Link>
            <Link
              to="/paymentTerms"
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
              Configured Payment Terms
            </Link>
            <Link
              to="/CreateConsumer"
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
             <IoPersonAddOutline style={{marginRight:'4px' ,color:'red'}} /> Add New Consumer
            </Link>
            <Link to ='/negotiation-requests/Creditor' className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600">
            Manage Negotiations
            </Link>
          </nav>
          <div className="flex align justify-center  mt-20">
            <button
              onClick={handleLogout}
              className="bg-blue-500 border flex items-center border-blue-500 text-white px-8 py-2 tracking-widest rounded-lg hover:bg-blue-50 hover:text-blue-500 transition duration-300"
            >
              Logout <IoIosLogOut style={{fontSize:"20px", marginLeft:'4px'}} />
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col justify-between p-4 bg-blue-400">
          <div className="flex-1 overflow-y-auto space-y-4  border-2 border-gray-300 rounded-lg p-4 shadow-md bg-gray-200">
            <h1 className="text-4xl text-blue-500 pt-6">
            Account Management
            </h1>
            <p className="text-gray-600">
              Welcome to your dashboard! Here you can manage your payment terms,
              view consumer details, and more.
            </p>

            {/* Consumer Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2  text-m  lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 ">
              {consumers.length > 0 ? (
                consumers.map((consumer) => {
                  const randomColor = getRandomColor(); 
                  const brightness = getColorBrightness(randomColor);
                  const textColor =
                    brightness > 120 ? "text-gray-800" : "text-white";
                  const headingColor =
                    brightness > 160
                      ? "text-gray-900"
                      : brightness > 110
                      ? "text-white"
                      : "text-yellow-200";
                  return (
                    
                      <div
                        key={consumer.id}
                        className="bg-gray-100 rounded-2xl  p-6  md:w-full  transition hover:shadow-lg shadow-lg hover:shadow-blue-200 border  border-gray-400 hover:cursor-not-allowed"
                        style={{
                          // backgroundColor: randomColor,
                          // color: textColor,
                          
                          // boxShadow: `0 4px 6px rgba(${parseInt(
                          //   randomColor.slice(1, 3),
                          //   16
                          // )}, ${parseInt(
                          //   randomColor.slice(3, 5),
                          //   16
                          // )}, ${parseInt(randomColor.slice(5, 7), 16)}, 0.3)`,
                          height: "280px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 className={`text-2xl    text-black mb-3 capitalize flex  items-center gap-1`}>
                          {consumer.firstname} {consumer.lastname}
                        </h3>
                        <p >
                          <strong className="text-sm text-gray-600">Email Address : </strong>{" "}
                          <span className="inline-block max-w-[180px] align-middle lg:truncate  text-blue-500 ">
                            {consumer.email}
                          </span>
                        </p>
                        <p >
                          <strong className="text-sm text-gray-600">Birth Date : </strong>{" "}
                          <span className="inline-block max-w-[180px] align-middle lg:truncate  text-blue-500 ">
                          {new Date(consumer.dob).toLocaleDateString()}  </span>
                        </p>

                        <p  >
                          <strong className="text-sm text-gray-600">Phone :</strong><span className="text-blue-500 ">{consumer.mobilenumber}</span>
                        </p>
                        <p className="text-gray-500 mt-2 italic "> View additional details below </p>

                        <div className="relative  mt-2 flex-grow flex justify-end">
                          <button
                            className={` p-1 absolute hover:scale-105  bg-blue-500 border border-blue-500 hover:text-blue-500  rounded-lg hover:bg-blue-50 transition duration-300 mt-2 text-white shadow-blue-500 flex items-center`}
                            onClick={() =>
                              navigate(`/CardDetails/${consumer._id || 'default'}`)
                            } > <CiSquareInfo style={{fontSize:'23px', marginRight:'4px'}} /> More Details</button>
                          
                        </div>
                      </div>
                    
                  );
                })
              ) : (
                <p className="text-gray-500">No consumers found</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default CreditorDashboard;
