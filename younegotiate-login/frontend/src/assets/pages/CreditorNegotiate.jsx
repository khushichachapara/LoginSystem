import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const NegotiateTerms = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCounterForm, setShowCounterForm] = useState(null);
    const [paymentType, setPaymentType] = useState("");
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

        fetchNegotiationOffers();
    }, [creditorId]);

    const selectedOffer = offers.find((o) => o._id === showCounterForm);

    const formik = useFormik({
        enableReinitialize: true, // Ensure the form reinitializes on offer selection
        initialValues: selectedOffer
            ? {
                offerId: selectedOffer._id || "",
                offertype: "",
                paymentdiscount:  "",
                installmentamount: "",
                duration:  "",
                paymentdate:  "",
                note:  "",
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

    return (
        <>
            <div className="bg-gray-100 p-10 min-h-screen">
                <div>
                    <h1 className="text-2xl font-bold mb-6 text-blue-500 ">
                        Consumer Negotiation Requests
                    </h1>
                    {offers.length === 0 ? (
                        <div >No offers from consumer You Can See Here if any
                         of Your consumer do negotiation request to You </div>
                    ) : (
                        offers.map((offer) => (
                            // console.log(offer._id),
                            <div
                                key={offer._id}
                                className="border rounded-lg p-5 bg-white shadow space-y-4 mb-6"
                            >
                                <div>
                                    <p>
                                        <strong>Consumer Name:</strong> {offer.consumer.firstname} {offer.consumer.lastname}
                                    </p>
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
                                    <p className="font-semibold text-blue-700 mb-2 text-lg">
                                        🔔 Negotiation Offer:
                                    </p>
                                    <p>
                                        <strong>Offer Type:</strong> {offer.offertype}
                                    </p>
                                    <p>
                                        <strong>Payment Discount :</strong> {offer.paymentdiscount}{" "}
                                        %
                                    </p>
                                    <p>
                                        <strong>First Payment Date:</strong>{" "}
                                        {new Date(offer.paymentdate).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Proposed Installment Amount:</strong>{" "}
                                        <span
                                            className={
                                                !offer.installmentamount
                                                    ? " text-red-500"
                                                    : "text-gray-500"
                                            }
                                        >
                                            {offer.installmentamount || "Not Applicable"}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Duration:</strong>{" "}
                                        <span
                                            className={
                                                !offer.duration ? " text-red-500" : "text-gray-500"
                                            }
                                        >
                                            {offer.duration || "Not Applicable"}
                                        </span>{" "}
                                    </p>
                                    <p>
                                        <strong>Message:</strong> {offer.note}
                                    </p>
                                   <div className="mt-4 font-serif text-lg"> {offer.status === "accepted" && (
                                        <p className="text-green-600 font-semibold">This Offer is Accepted by you</p>
                                    )}
                                    {offer.status === "rejected" && (
                                        <p className="text-red-600 font-semibold">This Offer is Rejected by you</p>
                                    )}
                                    {offer.status === "pending" && (
                                        <p className="text-yellow-600 font-semibold">This Offer is Under Review.</p>
                                    )}</div>
                                    <div className="mt-4 ">
                                        <button
                                            onClick={() => handleAccept(offer._id)}
                                            disabled={offer.status === "accepted"}
                                            className={`px-4 py-2 mr-4 mb-4 rounded border shadow-lg 
                                                      ${offer.status ===
                                                    "accepted"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-500 text-white hover:bg-white hover:text-blue-600 border-blue-600"
                                                }`}
                                        >
                                            {offer.status === 'accepted' ? 'Accepted' : 'Accept Offer'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(offer._id)}
                                            disabled={offer.status === 'rejected'}
                                            className={`px-4 py-2 mr-4  mb-4 rounded border shadow-lg 
                                                       ${offer.status ===
                                                    'rejected'
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-red-500 text-white hover:bg-white hover:text-red-500 border-red-500'}`}
                                        >
                                            {offer.status === 'rejected' ? 'Rejected' : 'Reject Offer'}
                                        </button>
                                        <button
                                            onClick={() => setShowCounterForm(offer._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-white hover:text-green-500 border border-green-500 shadow-lg "
                                        >
                                            Make New Offer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {selectedOffer && (
                        <div className="border border-blue-600 bg-white p-6 rounded-lg">
                            <div>
                                <h2 className="text-lg font-semibold text-blue-500 mb-4">
                                    {" "}
                                    Send a Counter Offer
                                </h2>
                                <button
                                    onClick={() => setShowCounterForm(null)}
                                    className="text-white hover:underline text-sm p-2 mb-4 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white border border-red-500 shadow-lg "
                                >
                                    Cancel
                                </button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-medium mb-1">Offer Type</label>
                                        <select
                                            className="w-full border px-3 py-2 rounded"
                                            name="offertype"
                                            value={formik.values.offertype}
                                            onChange={formik.handleChange}
                                        >
                                            <option value=""  >Select an option</option>
                                            <option>Full Payment</option>
                                            <option>Installments</option>
                                        </select>
                                        {formik.touched.offertype &&
                                            Boolean(formik.errors.offertype) && (
                                                <label className="text-red-500 text-sm m-2">
                                                    {formik.errors.offertype}
                                                </label>
                                            )}
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">
                                            Full Payment Discount (%)
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
                                        <label className="block font-medium mb-1">
                                            Installment Amount
                                        </label>
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
                                        <label className="block font-medium mb-1">
                                            Duration (in months)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border px-3 py-2 rounded"
                                            placeholder="e.g. 6"
                                            name="duration"
                                            disabled={isFullPayment}
                                            value={formik.values.duration}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.touched.duration &&
                                            Boolean(formik.errors.duration) && (
                                                <label className="text-red-500 text-sm m-2">
                                                    {formik.errors.duration}
                                                </label>
                                            )}
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full border px-3 py-2 rounded"
                                            value={formik.values.paymentdate}
                                            name="paymentdate"
                                            onChange={formik.handleChange}
                                        />
                                        {formik.touched.paymentdate &&
                                            Boolean(formik.errors.paymentdate) && (
                                                <label className="text-red-500 text-sm m-2">
                                                    {formik.errors.paymentdate}
                                                </label>
                                            )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block font-medium mb-1">
                                            Message (optional)
                                        </label>
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
                                    className="mt-4 bg-blue-500 hover:bg-white hover:text-blue-600  text-white px-4 py-2 rounded border border-blue-500 shadow-lg"
                                >
                                    Send Counter Offer
                                </button>
                            </form>
                        </div>
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
    );
};

export default NegotiateTerms;
