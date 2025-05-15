import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";



const DashbordConsumer = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consumer, setConsumer] = useState(null); // State to store consumer details
  const [creditor, setCreditor] = useState(null); // State to store creditor details
  const [loading, setLoading] = useState(true); // Loading state



  const handleLogout = () => {
    // Clear the login status from localStorage
    localStorage.removeItem("isLoggedInconsumer");
    localStorage.removeItem("tokenconsumer"); // Clear the token if you stored it
    localStorage.removeItem("loginTimeconsumer");
    localStorage.removeItem("consumerId"); // Clear the consumer ID if you stored it
    toast.info('successfully logged out!!');
    navigate("/login/consumer"); // Redirect to home or login
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("tokenconsumer");

        if (token) {
          // Fetch consumer details
          const consumerResponse = await axios.get(`http://localhost:5000/api/create_consumer/getConsumerById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('consumer data', consumerResponse.data); // Log the consumer data

          setConsumer(consumerResponse.data); // Set consumer details in state

          if (consumerResponse.data && consumerResponse.data.creditor) {


            const creditorId = consumerResponse.data.creditor._id;
            // console.log('Creditor ID:', creditorId); // Log the creditor ID

            // Fetch payment terms using the creditorId
            const paymentTermsResponse = await axios.get(`http://localhost:5000/api/creditor/getpaymentterms?id=${creditorId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log('payment terms data', paymentTermsResponse.data); // Log payment terms data

            setCreditor(paymentTermsResponse.data); // Set payment terms in state
          }

          if (consumerResponse.data.error) {
            console.error("Error:", consumerResponse.data.error);
          }

        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchData();
  }, [id]);


  return (


    <>
      <div className="flex h-screen bg-gray-100 ">
        {/* hamburgur */}

        <button
          className="absolute top-5 left-8 lg:hidden p-2 bg-blue-200 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        {/* sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gray-200 border border-gray-400 overflow-y-auto transform z-50  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              className="absolute top-2 right-4 lg:hidden text-2xl font-bold text-red-400"
            >
              ✕
            </button>
          </div>

          <nav className="flex-col space-y-4 flex items-center">
            <Link
              to={`/consumer/dashboard/${id}`}
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
              Overview
            </Link>
            <Link
              to={`/makepayment/${id}`}
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
              Make a Payment
            </Link>
            <Link
              to="/ConsumerHistory"
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
              📜 Transaction Log
            </Link>
            <Link
              to={`/negotiation-request/consumer/${id}`}
              className="flex items-center text-gray-700 hover:bg-gray-300 rounded-lg hover:text-blue-600"
            >
              Make Negotiation request
            </Link>
          </nav>
          <div className="flex align justify-center  mt-20">
            <button
              onClick={handleLogout}
              className="bg-blue-500 border border-blue-500 text-white px-8 py-2 tracking-widest rounded-lg hover:bg-blue-50 hover:text-blue-500 transition duration-300"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col justify-between p-4 bg-blue-400 ">
          <div className="flex-1 overflow-y-auto space-y-4  border-2 border-gray-300 rounded-lg p-4 shadow-lg  bg-gray-200 h-full">
            {consumer && (<h1 className="text-4xl font-bold text-blue-500 pt-6 capitalize">
              Welcome,{consumer.firstname}!!
            </h1>)}
            <p className="text-gray-600">
              Welcome! Here you can view your account status and payment history
            </p>

            {/* Consumer Info and Loading */}
            {loading ? (
              <p className="text-gray-700 text-xl animate-pulse">Loading your dashboard...</p>
            ) : (
              <>
                <div className="bg-white md:w-1/2 w-full p-4 border border-blue-500 shadow-xl shadow-sky-100 rounded-xl text-lg hover:cursor-not-allowed ">
                  {/* Consumer Card */}
                  {consumer && (
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-blue-500 mb-4">Your Account Overview</h2>
                      <p><span className="font-semibold">  Account Holder Name :</span> {consumer.firstname} {consumer.lastname}</p>
                      <p><span className="font-semibold">date of Birth :</span> {new Date(consumer.dob).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Account No :</span> <span className="text-red-600">{consumer.accountnumber}</span></p>
                      <p><span className="font-semibold ">Outstanding Balance :</span><span className="text-green-700"> ₹ {consumer.balance}</span></p>

                    </div>
                  )}

                  {/* Creditor Card */}
                  {creditor && (
                    <div >
                      <h6 className="text-xl font-bold text-blue-500 mb-4 ">Assigned Creditor & paymentTerms</h6>
                      <p><span className="font-semibold"> Creditor Name :</span> {consumer.creditor.name}</p>
                      <p><span className="font-semibold">Email Address :</span> {consumer.creditor.email}</p>


                      <p><span className="font-semibold">Full Payment Discount :</span> {creditor.paymentTerms.fullPaymentDiscount || 'N/A'}%</p>
                      <p><span className="font-semibold">Installment Discount :</span> {creditor.paymentTerms.installmentPaymentDiscount || 'N/A'}%</p>
                      <p><span className="font-semibold">First Payment Due In :</span> {creditor.paymentTerms.firstPaymentDateDuration || 'N/A'} days</p>
                    </div>
                  )}</div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};
export default DashbordConsumer;
