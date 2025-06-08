import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { TfiBell } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";

const NegotiateTerms = () => {

    const id = localStorage.getItem('creditorId');


    const [offers, setOffers] = useState([]);
    const [getCounter, setGetCounter] = useState([]);
    const [counterOfferData, setCounterOfferData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCounterForm, setShowCounterForm] = useState(null);
    const creditorId = localStorage.getItem("creditorId");

    useEffect(() => {
        const fetchNegotiationOffers = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/creditor/getnegotiationoffer/?creditorId=${creditorId}`
                );
                console.log("Negotiation offer:", response.data);

                setOffers(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch negotiation offers");
                setLoading(false);
            }
        };
        const getcounteroffer = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/create_consumer/getcounteroffer?creditorId=${creditorId}`);
                console.log("get counter offer", res.data);
                if (res.data) {
                    setGetCounter(res.data || []);
                    console.log("Counter data set:", res.data);
                } else {
                    console.log("Empty response data");
                }

            } catch (error) {
                console.log(error)
                setError("Failed to fetch negotiation offers", error);
                setLoading(false);
            }
        };

        fetchNegotiationOffers();
        getcounteroffer();
    }, [creditorId]);

    const selectedOffer = offers.find((o) => o._id === showCounterForm);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: selectedOffer
            ? {
                offerId: selectedOffer._id || "",
                offertype: "",
                paymentdiscount: "",
                installmentamount: "",
                duration: "",
                paymentdate: "",
                note: "",
            }
            : {
                offerId: "",
                offertype: "",
                paymentdiscount: "",
                installmentamount: "",
                duration: "",
                paymentdate: "",
                note: "",
            },
        validationSchema: Yup.object({
            offertype: Yup.string().required(
                "Selection Of Payment Terms is Required"
            ),
            paymentdiscount: Yup.number()
                .required("payment Discount is required")
                .min(1, "Full Payment Discount must be at least 0")
                .max(100, "Full Payment Discount must be at most 100"),
            installmentamount: Yup.number().positive(
                "installment balance should be positive"
            ),
            duration: Yup.number().min(1, "duration must be minimum 1 month"),
            paymentdate: Yup.date().required("this field is required"),
            note: Yup.string().max(500, "please send message less than 500 letters"),
        }),
        onSubmit: async (values) => {
            // Handle form submission logic
            console.log("Submitted values:", values);
            try {
                // Sending the response to the backend
                const response = await axios.post(
                    `http://localhost:5000/api/creditor/send-counter-offer`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
                        },
                    }
                );
                console.log(response);
                setShowCounterForm(null);
                toast.success("Counter offer sent successfully");
            } catch (err) {
                toast.error("Failed to submit response");
            }
        },
    });

    const handleAccept = async (offerId) => {
        try {
            await axios.patch(
                "http://localhost:5000/api/creditor/updatenegotiationstatus",
                {
                    offerId,
                    status: "accepted",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Update the offers state to reflect status change
            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer._id === offerId ? { ...offer, status: "accepted" } : offer
                )
            );
            toast.success("Offer accepted successfully!");
        } catch (err) {
            toast.error("Failed to accept offer.");
        }
    };



    const handleReject = async (offerId) => {
        try {
            await axios.patch(
                "http://localhost:5000/api/creditor/updatenegotiationstatus",
                {
                    offerId,
                    status: "rejected",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer._id === offerId ? { ...offer, status: "rejected" } : offer
                )
            );
            toast.success("Offer rejected successfully!");
        } catch (err) {
            toast.error("Failed to reject offer.");
        }
    };

    if (loading) return <div>Loading negotiation offers...</div>;
    if (error) return <div>{error}</div>;

    const maskAccountNumber = (account) => {
        return account?.length >= 4 ? "XXXX-XXXX-" + account.slice(8, 12) : account;
    };
    const isFullPayment = formik.values.offertype === 'Full Payment';

    // const matchingCounter = counterOfferData.find(
    //     (counter) => counter.offerId === offer._id
    // );

    return (
        <>
            <div className="bg-gray-100 p-10 min-h-screen">
                <div>
                    <h1 className="text-4xl  mb-6 text-blue-500 flex items-center justify-center">
                        Consumer Negotiation Requests
                    </h1>
                    <p className="mb-4 text-red-700  flex items-center justify-center">
                        Below are negotiation requests submitted by consumers. You can review each offer and choose to accept, reject, or make a counter-offer.
                    </p>
                    {offers.length === 0 ? (
                        <div>
                           No negotiation requests have been received from any consumer yet. Once a consumer submits an offer, it will appear here.

                        </div>
                    ) : (
                        offers.map((offer) => {
                            const matchingCounter = getCounter.find(
                                (counter) => counter.offerId === offer._id
                            );

                            return (
                                <div
                                    key={offer._id}
                                    className="border rounded-lg p-5 bg-white shadow space-y-4 mb-6"
                                >
                                    <div className="  flex flex-col items-center justify-center ">
                                        <div className="flex">

                                        <span><FaRegUser className="text-4xl text-pink-500  mr-3" /></span>
                                        <p className=" font-serif text-2xl  mb-4 text-pink-500  "> {offer.consumer.firstname} {offer.consumer.lastname}</p>
                                        </div>

                                        <p>
                                            <strong>Account Number:</strong>{" "}
                                            {maskAccountNumber(offer.consumer.accountnumber)}
                                        </p>
                                        <p>
                                            <strong>Email Address:</strong> {offer.consumer.email}
                                        </p>
                                        <p>
                                            <strong>Amount payable:</strong> {offer.consumer.balance} ₹
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
                                        <p className=" text-blue-500  text-2xl mb-4 flex items-center">
                                            <TfiBell style={{ marginRight: '6px', fontSize: '30px' }} /> Negotiation Offer :
                                        </p>
                                        <p>
                                            <strong>Payment Type :</strong> {offer.offertype}
                                        </p>
                                        <p>
                                            <strong>Payment Discount :</strong> {offer.paymentdiscount} %
                                        </p>
                                        <p>
                                            <strong>First Payment Date :</strong>{" "}
                                            {new Date(offer.paymentdate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Proposed Installment Amount :</strong>{" "}
                                            <span
                                                className={
                                                    !offer.installmentamount ? "text-red-500" : "text-gray-900"
                                                }
                                            >
                                                {offer.installmentamount || "Not Applicable"}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Duration (in Months) :</strong>{" "}
                                            <span
                                                className={!offer.duration ? "text-red-500" : "text-gray-900"}
                                            >
                                                {offer.duration || "Not Applicable"}
                                            </span> 
                                        </p>
                                        <p>
                                            <strong>Message:</strong> {offer.note}
                                        </p>


                                        <div className="mt-4 font-serif text-xl">
                                            {offer.status === "accepted" && (
                                                <p className="text-green-600 ">
                                                    Offer is Accepted by you
                                                </p>
                                            )}
                                            {offer.status === "rejected" && (
                                                <p className="text-red-600 ">
                                                     Offer is Rejected by you
                                                </p>
                                            )}
                                            {offer.status === "pending" && (
                                                <p className="text-yellow-600 ">
                                                     Offer is Under Review.
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-4">
                                            <button
                                                onClick={() => handleAccept(offer._id)}
                                                disabled={offer.status === "accepted"}
                                                className={`px-4 py-2  rounded border shadow-lg ${offer.status === "accepted"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-500 text-white hover:bg-white hover:text-blue-600 border-blue-600"
                                                    }`}
                                            >
                                                {offer.status === "accepted" ? "Accepted" : "Accept Offer"}
                                            </button>
                                            <button
                                                onClick={() => handleReject(offer._id)}
                                                disabled={offer.status === "rejected"}
                                                className={`px-4 py-2  rounded border shadow-lg ${offer.status === "rejected"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-red-500 text-white hover:bg-white hover:text-red-500 border-red-500"
                                                    }`}
                                            >
                                                {offer.status === "rejected" ? "Rejected" : "Reject Offer"}
                                            </button>
                                            <button
                                                onClick={() => setShowCounterForm(offer._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-white hover:text-green-500 border border-green-500 shadow-lg"
                                            >
                                                Make New Offer
                                            </button>
                                        </div>
                                        {showCounterForm === offer._id && (
                                            <div className="border border-blue-600 bg-white p-6 rounded-lg mt-4">
                                                <div>
                                                    <h2 className="text-lg  text-blue-500 mb-4">
                                                        Send a Counter Offer
                                                    </h2>
                                                    <button
                                                        onClick={() => setShowCounterForm(null)}
                                                        className="text-white hover:underline text-sm p-2 mb-4 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white border border-red-500 shadow-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <form onSubmit={formik.handleSubmit}>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block font-medium mb-1">Offer Type<span className="text-red-500">*</span></label>
                                                            <select
                                                                className="w-full border px-3 py-2 rounded"
                                                                name="offertype"
                                                                value={formik.values.offertype}
                                                                onChange={formik.handleChange}
                                                            >
                                                                <option value="">Select an option</option>
                                                                <option>Full Payment</option>
                                                                <option>Installments</option>
                                                            </select>
                                                            {formik.touched.offertype && Boolean(formik.errors.offertype) && (
                                                                <label className="text-red-500 text-sm m-2">
                                                                    {formik.errors.offertype}
                                                                </label>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block font-medium mb-1">
                                                                Full Payment Discount (%)<span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="w-full border px-3 py-2 rounded"
                                                                placeholder="e.g. 10"
                                                                name="paymentdiscount"
                                                                value={formik.values.paymentdiscount}
                                                                onChange={formik.handleChange}
                                                            />
                                                            {formik.touched.paymentdiscount &&
                                                                Boolean(formik.errors.paymentdiscount) && (
                                                                    <label className="text-red-500 text-sm m-2">
                                                                        {formik.errors.paymentdiscount}
                                                                    </label>
                                                                )}
                                                        </div>
                                                        <div>
                                                            <label className="block font-medium mb-1">Installment Amount</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border px-3 py-2 rounded"
                                                                placeholder="$ per month"
                                                                name="installmentamount"
                                                                disabled={isFullPayment}
                                                                value={formik.values.installmentamount}
                                                                onChange={formik.handleChange}
                                                            />
                                                            {formik.touched.installmentamount &&
                                                                Boolean(formik.errors.installmentamount) && (
                                                                    <label className="text-red-500 text-sm m-2">
                                                                        {formik.errors.installmentamount}
                                                                    </label>
                                                                )}
                                                        </div>
                                                        <div>
                                                            <label className="block font-medium mb-1">Duration (in months)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border px-3 py-2 rounded"
                                                                placeholder="e.g. 6"
                                                                name="duration"
                                                                disabled={isFullPayment}
                                                                value={formik.values.duration}
                                                                onChange={formik.handleChange}
                                                            />
                                                            {formik.touched.duration && Boolean(formik.errors.duration) && (
                                                                <label className="text-red-500 text-sm m-2">
                                                                    {formik.errors.duration}
                                                                </label>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block font-medium mb-1"> Payment Start Date <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="date"
                                                                className="w-full border px-3 py-2 rounded"
                                                                value={formik.values.paymentdate}
                                                                name="paymentdate"
                                                                onChange={formik.handleChange}
                                                            />
                                                            {formik.touched.paymentdate && Boolean(formik.errors.paymentdate) && (
                                                                <label className="text-red-500 text-sm m-2">
                                                                    {formik.errors.paymentdate}
                                                                </label>
                                                            )}
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block font-medium mb-1">Message (optional)</label>
                                                            <textarea
                                                                className="w-full border px-3 py-2 rounded"
                                                                placeholder="Add a note..."
                                                                value={formik.values.note}
                                                                name="note"
                                                                onChange={formik.handleChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="mt-4 bg-blue-500 hover:bg-white hover:text-blue-600 text-white px-4 py-2 rounded border border-blue-500 shadow-lg"
                                                    >
                                                        Send Counter Offer
                                                    </button>
                                                </form>
                                            </div>)
                                        }

                                        {matchingCounter && (
                                            <div className="mt-6 border-t pt-4 border-gray-800">
                                                <p className=" text-xl mb-4 text-red-600">
                                                    Your Counter Offer to This Offer :
                                                </p>
                                                <p>
                                                    <strong>Payment Type :</strong> {matchingCounter.offertype}
                                                </p>
                                                <p>
                                                    <strong> Payment Discount :</strong> {matchingCounter.paymentdiscount} %
                                                </p>
                                                <p>
                                                    <strong>First Payment Date:</strong>{" "}
                                                    {new Date(matchingCounter.paymentdate).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    <strong>Installment You Have Proposed :</strong>
                                                    <span className={!matchingCounter.installmentamount ? "text-red-500" : 'text-gray-900'}> {matchingCounter.installmentamount || "Not Applicable"}</span>
                                                </p>
                                                <p>
                                                    <strong>Duration (in Months):</strong>{" "}
                                                    <span className={!matchingCounter.duration ? "text-red-500" : 'text-gray-900'}> {matchingCounter.duration || "Not Applicable"}</span>
                                                </p>
                                                <p>
                                                    <strong>Message :</strong><span className={!matchingCounter.note ? "text-red-500" : "text-gray-900"}> {matchingCounter.note || "No note"}</span>
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                </div>


                            );
                        })
                    )}



                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Link to={`/creditor/dashboard/`}>
                        <button className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 border border-gray-900 text-gray-800 font-medium">
                            Back To Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </>




//         <>
//   <div className="bg-gray-100 p-10 min-h-screen">
//     <h1 className="text-4xl font-bold mb-6 text-blue-500 text-center">
//       Consumer Negotiation Requests
//     </h1>
//     <p className="mb-6 text-red-700 text-center">
//       Below are negotiation requests submitted by consumers. You can review each offer and choose to accept, reject, or make a counter-offer.
//     </p>

//     {offers.length === 0 ? (
//       <p className="text-center text-gray-600">No offers yet. Any consumer negotiations will be listed here.</p>
//     ) : (
//       <div className="overflow-x-auto">
//         <table className="w-full border text-left text-sm shadow-lg bg-white">
//           <thead className="bg-blue-100 text-blue-700">
//             <tr>
//               <th className="p-3 border">Consumer</th>
//               <th className="p-3 border">Account #</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Balance (₹)</th>
//               <th className="p-3 border">Offer Type</th>
//               <th className="p-3 border">Discount (%)</th>
//               <th className="p-3 border">Installment</th>
//               <th className="p-3 border">Duration</th>
//               <th className="p-3 border">First Payment</th>
//               <th className="p-3 border">Message</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {offers.map((offer) => {
//               const matchingCounter = getCounter.find(c => c.offerId === offer._id);
//               return (
//                 <tr key={offer._id} className="hover:bg-gray-50">
//                   <td className="p-3 border font-semibold text-pink-600">
//                     {offer.consumer.firstname} {offer.consumer.lastname}
//                   </td>
//                   <td className="p-3 border">{maskAccountNumber(offer.consumer.accountnumber)}</td>
//                   <td className="p-3 border">{offer.consumer.email}</td>
//                   <td className="p-3 border">{offer.consumer.balance}</td>
//                   <td className="p-3 border">{offer.offertype}</td>
//                   <td className="p-3 border">{offer.paymentdiscount}%</td>
//                   <td className="p-3 border">
//                     {offer.installmentamount || <span className="text-red-500">N/A</span>}
//                   </td>
//                   <td className="p-3 border">
//                     {offer.duration || <span className="text-red-500">N/A</span>}
//                   </td>
//                   <td className="p-3 border">{new Date(offer.paymentdate).toLocaleDateString()}</td>
//                   <td className="p-3 border">{offer.note || <span className="text-gray-400">No note</span>}</td>
//                   <td className="p-3 border font-semibold">
//                     {offer.status === 'accepted' && <span className="text-green-600">Accepted</span>}
//                     {offer.status === 'rejected' && <span className="text-red-600">Rejected</span>}
//                     {offer.status === 'pending' && <span className="text-yellow-600">Under Review</span>}
//                   </td>
//                   <td className="p-3 border space-y-2">
//                     <button
//                       onClick={() => handleAccept(offer._id)}
//                       disabled={offer.status === 'accepted'}
//                       className={`w-full px-3 py-1 text-sm rounded ${offer.status === 'accepted'
//                         ? 'bg-gray-300 cursor-not-allowed'
//                         : 'bg-blue-500 text-white hover:bg-white hover:text-blue-600 border border-blue-600'
//                       }`}
//                     >
//                       {offer.status === 'accepted' ? 'Accepted' : 'Accept'}
//                     </button>
//                     <button
//                       onClick={() => handleReject(offer._id)}
//                       disabled={offer.status === 'rejected'}
//                       className={`w-full px-3 py-1 text-sm rounded ${offer.status === 'rejected'
//                         ? 'bg-gray-300 cursor-not-allowed'
//                         : 'bg-red-500 text-white hover:bg-white hover:text-red-600 border border-red-600'
//                       }`}
//                     >
//                       {offer.status === 'rejected' ? 'Rejected' : 'Reject'}
//                     </button>
//                     <button
//                       onClick={() => setShowCounterForm(offer._id)}
//                       className="w-full px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-white hover:text-green-600 border border-green-600"
//                       >
//                       Make Offer
//                     </button>
//                         <div>
//                       {showCounterForm === offer._id && (
//                                          <div className="border border-blue-600 bg-white p-6 rounded-lg mt-4">
//                                              <div>
//                                                  <h2 className="text-lg  text-blue-500 mb-4">
//                                                      Send a Counter Offer
//                                                  </h2>
//                                                  <button
//                                                      onClick={() => setShowCounterForm(null)}
//                                                      className="text-white hover:underline text-sm p-2 mb-4 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white border border-red-500 shadow-lg"
//                                                  >
//                                                      Cancel
//                                                  </button>
//                                              </div>
//                                              <form onSubmit={formik.handleSubmit}>
//                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                      <div>
//                                                          <label className="block font-medium mb-1">Offer Type<span className="text-red-500">*</span></label>
//                                                          <select
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              name="offertype"
//                                                              value={formik.values.offertype}
//                                                              onChange={formik.handleChange}
//                                                          >
//                                                              <option value="">Select an option</option>
//                                                              <option>Full Payment</option>
//                                                              <option>Installments</option>
//                                                          </select>
//                                                          {formik.touched.offertype && Boolean(formik.errors.offertype) && (
//                                                              <label className="text-red-500 text-sm m-2">
//                                                                  {formik.errors.offertype}
//                                                              </label>
//                                                          )}
//                                                      </div>
//                                                      <div>
//                                                          <label className="block font-medium mb-1">
//                                                              Full Payment Discount (%)<span className="text-red-500">*</span>
//                                                          </label>
//                                                          <input
//                                                              type="number"
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              placeholder="e.g. 10"
//                                                              name="paymentdiscount"
//                                                              value={formik.values.paymentdiscount}
//                                                              onChange={formik.handleChange}
//                                                          />
//                                                          {formik.touched.paymentdiscount &&
//                                                              Boolean(formik.errors.paymentdiscount) && (
//                                                                  <label className="text-red-500 text-sm m-2">
//                                                                      {formik.errors.paymentdiscount}
//                                                                  </label>
//                                                              )}
//                                                      </div>
//                                                      <div>
//                                                          <label className="block font-medium mb-1">Installment Amount</label>
//                                                          <input
//                                                              type="number"
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              placeholder="$ per month"
//                                                              name="installmentamount"
//                                                              disabled={isFullPayment}
//                                                              value={formik.values.installmentamount}
//                                                              onChange={formik.handleChange}
//                                                          />
//                                                          {formik.touched.installmentamount &&
//                                                              Boolean(formik.errors.installmentamount) && (
//                                                                  <label className="text-red-500 text-sm m-2">
//                                                                      {formik.errors.installmentamount}
//                                                                  </label>
//                                                              )}
//                                                      </div>
//                                                      <div>
//                                                          <label className="block font-medium mb-1">Duration (in months)</label>
//                                                          <input
//                                                              type="number"
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              placeholder="e.g. 6"
//                                                              name="duration"
//                                                              disabled={isFullPayment}
//                                                              value={formik.values.duration}
//                                                              onChange={formik.handleChange}
//                                                          />
//                                                          {formik.touched.duration && Boolean(formik.errors.duration) && (
//                                                              <label className="text-red-500 text-sm m-2">
//                                                                  {formik.errors.duration}
//                                                              </label>
//                                                          )}
//                                                      </div>
//                                                      <div>
//                                                          <label className="block font-medium mb-1"> Payment Start Date <span className="text-red-500">*</span></label>
//                                                          <input
//                                                              type="date"
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              value={formik.values.paymentdate}
//                                                              name="paymentdate"
//                                                              onChange={formik.handleChange}
//                                                          />
//                                                          {formik.touched.paymentdate && Boolean(formik.errors.paymentdate) && (
//                                                              <label className="text-red-500 text-sm m-2">
//                                                                  {formik.errors.paymentdate}
//                                                              </label>
//                                                          )}
//                                                      </div>
//                                                      <div className="md:col-span-2">
//                                                          <label className="block font-medium mb-1">Message (optional)</label>
//                                                          <textarea
//                                                              className="w-full border px-3 py-2 rounded"
//                                                              placeholder="Add a note..."
//                                                              value={formik.values.note}
//                                                              name="note"
//                                                              onChange={formik.handleChange}
//                                                          ></textarea>
//                                                      </div>
//                                                  </div>
//                                                  <button
//                                                      type="submit"
//                                                      className="mt-4 bg-blue-500 hover:bg-white hover:text-blue-600 text-white px-4 py-2 rounded border border-blue-500 shadow-lg"
//                                                  >
//                                                      Send Counter Offer
//                                                  </button>
//                                              </form>
//                                          </div>)
//                                      }</div>
//                   </td>
//                 </tr>
                
//             );
//         })}
//           </tbody>
//         </table>
//       </div>
//     )}
//   </div>
// </>


    );
};

export default NegotiateTerms;
