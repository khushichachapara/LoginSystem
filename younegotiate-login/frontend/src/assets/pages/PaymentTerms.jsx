import react from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState ,useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";


const PaymentTerms = () => {

  // const [form, setForm] = useState({
  //   fullPaymentDiscount: "",
  //   installmentPaymentDiscount: "",
  //   firstPaymentDateDuration: "",

  // });
  
    
  // const handlechange = (e) => {
    
  //   setForm({ ...form, [e.target.name]: e.target.value });
  //   const er = document.getElementById("error");
  //   er.innerHTML = ""; 
   
  // };
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const [initialValues, setInitialValues] = useState({
    fullPaymentDiscount: "",
    installmentPaymentDiscount: "",
    firstPaymentDateDuration: "",
  });

  // Fetch saved payment terms from the backend or localStorage
  useEffect(() => {
    const fetchPaymentTerms = async () => {
      try {
        // You can replace this with a call to your backend to get payment terms
        const response = await axios.get("http://localhost:5000/api/creditor/getpaymentterms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Payment Terms: ", response.data); 

        if (Array.isArray(response.data.paymentTerms) && response.data.paymentTerms.length>0) {
          setInitialValues({
            fullPaymentDiscount: response.data.paymentTerms[0].fullPaymentDiscount || "",
            installmentPaymentDiscount: response.data.paymentTerms[0].installmentPaymentDiscount || "",
            firstPaymentDateDuration: response.data.paymentTerms[0].firstPaymentDateDuration || "",
          });
        }
        
      } catch (error) {
        console.error("Error fetching payment terms:", error);
      }
    };

    fetchPaymentTerms();
  }, [token]);


 const  validationSchema = Yup.object({
    fullPaymentDiscount: Yup.number()
      .required("Full Payment Discount is required")
      .min(0, "Full Payment Discount must be at least 0")
      .max(100, "Full Payment Discount must be at most 100"),
    installmentPaymentDiscount: Yup.number()
      .required("Installment Payment Discount is required")
      .min(0, "Installment Payment Discount must be at least 0")
      .max(100, "Installment Payment Discount must be at most 100"),
    firstPaymentDateDuration: Yup.number()
      .required("First Payment Date Duration is required")
      .min(1, "First Payment Date Duration must be at least 1")
      .max(365, "First Payment Date Duration must be at most 365"),
  });


  const formik= useFormik({
    validationSchema: validationSchema,
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  
  
  
  const handleSubmit = async (value) => {
     // value.preventDefault();
      
    
    // const er = document.getElementById("error");
    // er.innerHTML = "";

    const { fullPaymentDiscount, installmentPaymentDiscount, firstPaymentDateDuration } = value;
    //console.log("submitting form:", form);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/creditor/paymentterms",
        {
          fullPaymentDiscount,
          installmentPaymentDiscount,
          firstPaymentDateDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`  // Add the token here
          }
        }
      );
      
      toast.info("Payment terms set successfully!");
      console.log("Response:", response.data);

      setInitialValues({
      fullPaymentDiscount,
      installmentPaymentDiscount,
      firstPaymentDateDuration,
    });

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
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4 relative overflow-auto">
        <form
        onSubmit={formik.handleSubmit}

         className="bg-white p-8 pb-20 rounded-xl shadow-md w-full max-w-8xl ">
          <h1 className="text-4xl  mb-6 text-center text-blue-500 ">
            Set Payment Terms
          </h1>
          <p className="text-red-700 mb-4">
            Configure the payment terms for your consumers including discounts
            and payment schedules.
          </p>
          

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Full Payment Discount */}
            <div>
              <label
                className="block text-gray-700 text-lg font-bold mb-2 mt-2"
                htmlFor="Full Payment Discount"
              >
                Full Payment Discount (%)
              </label>
              <p className="text-sm text-gray-400 m-2">
                This is the percentage discount offered to consumers who choose
                to pay their entire balance in one lump sum. It's a way to
                encourage faster payments and reduce the risk of delayed
                installments. For example, if the discount is set to 10%, a
                ₹10,000 debt will become ₹9,000 if paid in full immediately.
              </p>

              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                name="fullPaymentDiscount"
                onChange={formik.handleChange}
                value={formik.values.fullPaymentDiscount}
                
                placeholder="Enter discount %"
              />{formik.touched.fullPaymentDiscount && formik.errors.fullPaymentDiscount && (
                <div className="text-red-500 text-sm">{formik.errors.fullPaymentDiscount}</div> 
              )}
            </div>
            
            {/* Installment Payment Discount */}
            <div>
              <label
                className="block text-gray-700 text-lg font-bold mb-2 mt-2"
                htmlFor="Installment Payment Discount"
              >
                Installment Payment Discount (%)
              </label>

              <p className="text-sm text-gray-400 m-2">
                This discount applies to consumers who prefer to pay in multiple
                parts instead of a full amount. It incentivizes them to commit
                to regular smaller payments. For instance, offering a 5%
                discount across 3 installments can help boost repayment
                consistency while still offering a small benefit.
              </p>

              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                value={formik.values.installmentPaymentDiscount}
                name="installmentPaymentDiscount"
                onChange={formik.handleChange}
                placeholder="Enter discount %"
              />{formik.touched.installmentPaymentDiscount && formik.errors.installmentPaymentDiscount && (
                <div className="text-red-500 text-sm">{formik.errors.installmentPaymentDiscount}</div> 
              )}
            </div>

            {/* First Payment Date Duration */}
            <div>
              <label
                className="block text-gray-700 text-lg font-bold mb-2 mt-2"
                htmlFor="First Payment Date Duration"
              >
                First Payment Date Duration (day)
              </label>

              <p className="text-sm text-gray-400 m-2">
                This defines how many days a consumer has before they must make
                their first payment after their account is created. For example,
                setting it to 30 means the first payment is expected within 30
                days from the date of agreement. It helps both the creditor and
                consumer have a clear payment start timeline.
              </p>

              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                value={formik.values.firstPaymentDateDuration}
                name="firstPaymentDateDuration"
                onChange={formik.handleChange}
                placeholder="eg:30"
              />{formik.touched.firstPaymentDateDuration && formik.errors.firstPaymentDateDuration && (
                <div className="text-red-500 text-sm">{formik.errors.firstPaymentDateDuration}</div> 
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="absolute bottom-8 right-6 space-x-4">
            <Link to="/creditor/dashboard">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400  border border-gray-700 text-gray-800 font-medium  "
              >
                Back to Dashbord
              </button>
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-50 text-white font-medium border border-blue-500 hover:text-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default PaymentTerms;
