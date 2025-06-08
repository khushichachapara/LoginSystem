import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';


const ConsumerNegotiation = () => {
  const { id } = useParams();
  //console.log(id);



  const [consumer, setConsumer] = useState(null);
  const [creditorOffer, setCreditorOffer] = useState(null);
  const [offerStatus, setOfferStatus] = useState(null);
  const [paymentterms, setPaymentterms] = useState(null);
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object({
    offertype: yup
      .string()
      .required('Selection Of Payment Terms is Required'),
    paymentdiscount: yup
      .number()
      .required('payment Discount is required')
      .min(1, "Full Payment Discount must be at least 1")
      .max(100, "Full Payment Discount must be at most 100"),
    installmentamount: yup
      .number()
      .positive('installment balance should be positive'),
    duration: yup
      .number()
      .min(1, "duration must be minimunm 1 month"),
    paymentdate: yup
      .date()
      .required('this fiels is requied'),
    note: yup
      .string()
      .max(200, 'please send message less than 500 letters'),


  });

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      offertype: "",
      paymentdiscount: "",
      installmentamount: "",
      duration: "",
      paymentdate: "",
      note: "",

    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });



  const handleSubmit = async (value) => {

    console.log('formik data', value);


    const {
      offertype,
      paymentdiscount,
      installmentamount,
      duration,
      paymentdate,
      note,

    } = value;


    try {
      const token = localStorage.getItem("tokenconsumer");

      if (!token) {
        alert("You are not logged in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const Response = await axios.post('http://localhost:5000/api/create_consumer/sendnegotiationoffer', {
        offertype,
        paymentdiscount,
        installmentamount,
        duration,
        paymentdate,
        note,
      }, config);
      console.log("offer data", Response.data);
      toast.info('Negotiation offer Sent to Creditor Successfully !!!');

      formik.resetForm();
    }
    catch (err) {
      if (err.response) {
        console.error("Error Response:", err.response);
        toast.error(err.response?.data?.message || "Failed to send offer.");
      } else {
        console.error("Unexpected Error:", err);
        toast.error("Unexpected error occurred.");
      }
    }
  }

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

          console.log('consumer data', consumerResponse.data);

          if (consumerResponse.data.error) {
            console.error("Error:", consumerResponse.data.error);
          }
          setConsumer(consumerResponse.data);

          const offerResponse = await axios.get(`http://localhost:5000/api/create_consumer/getcounteroffer`, {
            params: {
              consumerId: id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("offerResponse", offerResponse.data)

          setCreditorOffer(offerResponse.data);

          const offerStatus = await axios.get('http://localhost:5000/api/create_consumer/getbyconsumer', {
            params: { consumerId: id },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(offerStatus.data);

          setOfferStatus(offerStatus.data);

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

            setPaymentterms(paymentTermsResponse.data); // Set payment terms in state
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


  const handleClick = () => {
    toast.success('You have Accept Counter Offer By Creditor');
  };
  const handlerejection =()=>{
    toast.success('you have rejected Counter Offer By creditor')
  }
  const cleanForm = () => {
    formik.resetForm();
  };
  const isFullPayment = formik.values.offertype === 'Full Payment';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-4xl  mb-6 text-blue-500 flex justify-center items-center">
        Negotiate Your Payment Amount Here
      </h1>

      {/* Account Summary */}
      {consumer && (<div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-xl  text-blue-500 mb-2">
          Account Summary Of <span className="text-red-500 text-2xl">{consumer.firstname} {consumer.lastname}</span>
        </h2>
        <p><strong>Account Number :</strong> {consumer.accountnumber} </p>
        <p><strong>payable Amount :</strong> {consumer.balance} ₹ </p>
        {paymentterms && (<>
          <p><strong> Inistial Full Payment Discount Set by Creditor : </strong> {paymentterms.paymentTerms.fullPaymentDiscount} %</p>
          <p><strong>Initial installment Discount Set by Creditor : </strong> {paymentterms.paymentTerms.installmentPaymentDiscount} %</p>

        </>
        )}


        {Array.isArray(offerStatus) && offerStatus.map((offer) => (
          <div key={offer._id} className="mt-6 border-t border-gray-900 ">
            <h3 className="text-xl font-semibold  text-blue-500 mb-2 mt-2"> Previouse Offer Sent To Creditor</h3>
            <div>
              <p><strong> Your Requested Offer Type :</strong> {offer.offertype}</p>
              <p><strong> Payment discount Percentage :</strong> {offer.paymentdiscount} % </p>
              <p><strong>Payment First date :</strong> {new Date(offer.paymentdate).toLocaleDateString()} </p>
              {offer.status === "accepted" && (
                <p className="text-green-600 font-semibold">Your This Offer is Accepted.</p>
              )}
              {offer.status === "rejected" && (
                <p className="text-red-600 font-semibold">Your This Offer is Rejected.</p>
              )}
              {offer.status === "pending" && (
                <p className="text-yellow-600 font-semibold">Your This Offer is Under Review.</p>
              )}
            </div>
          </div>
        ))}


      </div>)}

      {/* Creditor Counter Offer */}
      {/* {creditorOffer && creditorOffer.length > 0 && creditorOffer.map ((offer) => (
        <div key={offer._id} className="bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-md p-5 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Creditor's Counter Offer
          </h2>
          <p><strong>Payment Method :</strong> {offer.offertype} </p>
          <p><strong>Payment Discount :</strong> {offer.paymentdiscount}% </p>
          <p><strong>Payment Date :</strong> {new Date(offer.paymentdate).toLocaleDateString()}</p>
          <p><strong>Message :</strong> {offer.note} </p>
          <div className="mt-4">
            <button
              onClick={() => handleClick()}
              id="accepted"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:text-blue-600 hover:bg-white border border-blue-600 mb-2">
              Accept Offer
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:text-red-500 hover:bg-white border border-red-500 mb-2">
              Reject Offer
            </button>
            <a href="#negotiation-form"><button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-white hover:text-green-600 border border-green-600">
              Make New Offer
            </button></a>
          </div>
        </div>
      ))} */}

      {creditorOffer && creditorOffer.length > 0 && creditorOffer.map(counterOffer => {
        const matchedOffer = Array.isArray(offerStatus)
          ? offerStatus.find(offer => String(offer._id) === String(counterOffer.offerId))
          : null;

        return (
          <div key={counterOffer._id} className="bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-md p-5 mb-6">

            {/* Show previous offer if matched */}
            {matchedOffer && (
              <div className="mb-4 pb-4  rounded border-b border-gray-900">
                <h3 className="text-xl  text-blue-500 mb-2">Your Negotiation request..</h3>
                <p><strong>Your Requested Offer Type :</strong> {matchedOffer.offertype}</p>
                <p><strong>Payment Discount Percentage :</strong> {matchedOffer.paymentdiscount} %</p>
                <p><strong>Installment Amount :</strong> {matchedOffer.installmentamount}</p>
                <p><strong>Payment First Date   :</strong> {new Date(matchedOffer.paymentdate).toLocaleDateString()}</p>
                <p><strong>Message To Creditor :</strong> {matchedOffer.note}</p>
                {matchedOffer.status === "accepted" && <p className="text-green-600 text-xl font-serif"> Offer is Accepted.</p>}
                {matchedOffer.status === "rejected" && <p className="text-red-600 text-xl font-serif">Offer is Rejected.</p>}
                {matchedOffer.status === "pending" && <p className="text-yellow-600 text-xl font-serif"> Offer is Under Review.</p>}
              </div>
            )}

            {/* Creditor Counter Offer */}
            <h2 className="text-xl  text-blue-500 mb-2">Creditor's Counter Offer</h2>
            <p><strong>Payment Method :</strong> {counterOffer.offertype} </p>
            <p><strong>Payment Discount :</strong> {counterOffer.paymentdiscount}% </p>
            <p><strong>Installment Amount :</strong>  {counterOffer.installmentamount}</p>
            <p><strong>Payment First Date :</strong> {new Date(counterOffer.paymentdate).toLocaleDateString()}</p>
            <p><strong>Message to Consumer :</strong> {counterOffer.note} </p>

            <div className="mt-4">
              <button
                onClick={() => handleClick()}
                id="accepted"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:text-blue-600 hover:bg-white border border-blue-600 mb-2"
              >
                Accept Offer
              </button>
              <button
              onClick={() => handlerejection()}
              id="rejected"
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:text-red-500 hover:bg-white border border-red-500 mb-2"
              >
                Reject Offer
              </button>
              <a href="#negotiation-form">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-white hover:text-green-600 border border-green-600">
                  Make New Offer
                </button>
              </a>
            </div>
          </div>
        );
      })}




      {/* Negotiation Form */}
      <form onSubmit={formik.handleSubmit}>

        <div className="border border-blue-600 bg-white p-6 rounded-lg">
          <h2 id="negotiation-form" className="text-lg  text-blue-500 mb-4"> Send a Negotiation Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Offer Type <span className="text-red-500">*</span></label>
              <select className="w-full border px-3 py-2 rounded"
                name="offertype"
                value={formik.values.offertype}
                onChange={formik.handleChange}
                required
              >
                <option value="">Select an option</option>
                <option>Full Payment</option>
                <option>Installments</option>
              </select>
              {formik.touched.offertype && Boolean(formik.errors.offertype) && (
                <label className="text-red-500 text-sm m-2">{formik.errors.offertype}</label>
              )}

            </div>
            <div>
              <label className="block font-medium mb-1"> Payment Discount (%)<span className="text-red-500">*</span></label>
              <input type="number"
                name="paymentdiscount"
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. 10"
                value={formik.values.paymentdiscount}
                onChange={formik.handleChange}
                autoComplete="off"
                required

              />

              {formik.touched.paymentdiscount && Boolean(formik.errors.paymentdiscount) && (
                <label className="text-red-500 text-sm m-2">{formik.errors.paymentdiscount}</label>
              )}


            </div>
            <div>
              <label className="block font-medium mb-1">Installment Amount</label>
              <input type="number"
                disabled={isFullPayment}
                name='installmentamount'
                className="w-full border px-3 py-2 rounded"
                value={formik.values.installmentamount || ''}
                onChange={formik.handleChange}
                placeholder="$ per month" />
              {formik.touched.installmentamount && Boolean(formik.errors.installmentamount) && (
                <label className="text-red-500 text-sm m-2">{formik.errors.installmentamount}</label>
              )}

            </div>
            <div>
              <label className="block font-medium mb-1">Duration (in months)</label>
              <input type="number"
                name="duration"
                disabled={isFullPayment}
                className="w-full border px-3 py-2 rounded"
                value={formik.values.duration || ''}
                onChange={formik.handleChange}
                placeholder="e.g. 6" />
              {formik.touched.duration && Boolean(formik.errors.duration) && (
                <label className="text-red-500 text-sm m-2">{formik.errors.duration}</label>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">payment Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="paymentdate"
                value={formik.values.paymentdate}
                onChange={formik.handleChange}
                required
                className="w-full border px-3 py-2 rounded" />
              {formik.touched.paymentdate && Boolean(formik.errors.paymentdate) && (
                <label className="text-red-500 text-sm m-2">{formik.errors.paymentdate}</label>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Message (optional)</label>
              <textarea className="w-full border px-3 py-2 rounded"
                name="note"
                placeholder="Add a note for creditor..."
                value={formik.values.note}
                onChange={formik.handleChange}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-white hover:text-blue-600  text-white px-4 py-2  border rounded-lg border-blue-500 shadow-lg">
            Send Offer
          </button>
          <button onClick={() => cleanForm()} className="text-white  text-md p-2 mb-4 bg-red-500 rounded-lg hover:text-red-500 m-4 w-20  hover:bg-white border border-red-500 shadow-lg ">Cancel</button>
        </div>

      </form>

      <div className="mt-6 flex justify-end gap-4">
        <Link to={`/consumer/dashboard/${id}`}>
          <button className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 border border-gray-900 text-gray-800 font-medium">
            Back To Dashboard
          </button></Link>
      </div>
    </div>
  );

}
export default ConsumerNegotiation;