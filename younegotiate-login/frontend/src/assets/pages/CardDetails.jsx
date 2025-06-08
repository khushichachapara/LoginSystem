import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import { FaAddressCard } from "react-icons/fa6";

const CardDetails = () => {
  const [consumer, setConsumer] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const { id } = useParams(); 
  //console.log("id", id);
  
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const consumerRes = await axios.get(`http://localhost:5000/api/create_consumer/getConsumers?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const termsRes = await axios.get(`http://localhost:5000/api/creditor/getpaymentterms`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        // console.log("Consumer Response: ", consumerRes);
        
        if (consumerRes.data.consumer) {
          console.log("Consumer with paymentTerm:", {
            ...consumerRes.data.consumer,
           paymentTerm: termsRes.data.paymentTerms
          });
          setConsumer({
            ...consumerRes.data.consumer,
            paymentTerm: termsRes.data.paymentTerms
          });
          
        } else {
          console.error("No consumer found.");
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
       
      }finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  
  if (loading) {
    return (  
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
      </div>
    );
  }
  if(!consumer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 font-bold text-xl">Consumer not found</div>
      </div>
    );
  }

  const maskAccountNumber = (account) => {
    return account?.length >= 4 ? "XXXX-XXXX-" + account.slice(8, 12) : account;
  };
  
  //const truncate = consumer?.accountnumber?.length >= 4 ?  "XXXX-XXXX-" + consumer?.accountnumber.slice(8, 12)  : consumer?.accountnumber;
  
  return (
    <div className="bg-gray-100 min-h-screen py-8 ">
      <div className="max-w-4xl mx-auto m-4 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl  text-blue-600 mb-6 text-center">
          Consumer Details 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
          <div>
            <p>
              <span className="font-semibold">FirstName :</span> {consumer.firstname}
            </p>
            <p>
              <span className="font-semibold">LastName :</span> {consumer.lastname} 
            </p>
            <p>
              <span className="font-semibold">Date of Birth :</span>
               {new Date(consumer.dob).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Email Address :</span> {consumer.email}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Contact :</span>{" "}
               {consumer.mobilenumber}
            </p>
            <p>
              <span className="font-semibold"> Bank Account No. :</span>{" "}
               {maskAccountNumber(consumer.accountnumber)}
            </p>

          <p>
            <span className="font-semibold">Payable Oustanding Amount :</span>{" "}
            ₹ {consumer.balance} 
          </p>

          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-100 border border-blue-100 rounded-lg ">
          <h3 className="text-2xl  mb-4 text-blue-700 flex items-center">
             <FaAddressCard  style={{marginRight:'6px', fontSize:'25px'}}/>Payment Terms
          </h3>
          <p>
            <span className="font-medium">Full Payment Discount : </span>{" "}
            <span className="text-red-500 text-xl "> {consumer.paymentTerm?.[0]?.fullPaymentDiscount || 'N/A' } % </span>
          </p>
          <p>
            <span className="font-medium">Installment Discount : </span>{" "}
            <span className="text-red-500 text-xl "> {consumer.paymentTerm?.[0]?.installmentPaymentDiscount  || 'N/A'} % </span>
          </p> 
          <p>
            <span className="font-medium">First Payment Due In : </span>{" "}
            <span className="text-red-500 text-xl">{consumer.paymentTerm[0]?.firstPaymentDateDuration  || 'N/A'} days</span>
          </p> 
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link to="/creditor/dashboard">
            <button className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 border border-gray-900 text-gray-800 font-medium">
              Back To Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CardDetails;
