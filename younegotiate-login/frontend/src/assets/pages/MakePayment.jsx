import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const MakePayment = () => {
    const { id } = useParams();
    
    const [paymenttype, setpaymenttype] = useState(null);
    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4 ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-center mb-4 text-blue-500">
                    Payment Options or Initiate Negotiation with Creditor
                </h2>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 mr-4">
                        <button
                            onClick={() => setpaymenttype('full')}
                            className="w-full py-2 px-4 bg-white  text-blue-600 hover:text-white border border-blue-500 shadow-md shadow-blue-100 hover:scale-105 rounded-lg hover:bg-blue-500">
                            Full Payment
                        </button>
                    </div>
                    <div className="flex-1 ml-4">
                        <button
                            onClick={() => setpaymenttype('installment')}
                            className="w-full py-2 px-4 bg-blue-500 hover:bg-white text-white hover:text-blue-600 hover:scale-105 border border-blue-500 shadow-lg rounded-lg shadow-blue-100 ">
                            Installments
                        </button>
                    </div>
                </div>  {paymenttype && (
                    <div className="mt-4 mb-6">
                        <p className="text-red-500 text-lg">{paymenttype === 'full' ? 'Fully Loan Payment' : 'Installment Payment '}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-gray-600">Amount</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600">Payment Method</label>
                                <select className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
                                    <option>Credit Card</option>
                                    <option>Stripe</option>
                                    <option>PayPal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-600">Due Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                                />
                            </div>

                            {paymenttype === 'installment' && (
                                <div>
                                    <label className="block text-gray-600">Installment Duration</label>
                                    <select className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
                                        <option>1 Month</option>
                                        <option>3 Months</option>
                                        <option>6 Months</option>
                                        <option>12 Months</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-600">Message to Creditor</label>
                                <textarea
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Add a message"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <p className="text-center text-black font-medium mb-16 text-lg">
                    As a consumer, you can choose to either pay the full amount in
                    one go or opt for an installment plan if that suits you better.
                    Select the option that works best for your financial situation.
                    If needed, you can also initiate a negotiation with the creditor for more flexible terms.
                </p>
                <div className='m-4'>
                   <Link to="/">
                        <button className='p-2 rounded-lg shadow-green-100 bg-green-500 text-white  border border-green-500 hover:bg-white hover:text-green-600 mr-4 mb-4'>
                           Submit Payment
                        </button>
                    </Link>
                    <Link to={`/negotiation-request/consumer/${id}`}>
                        <button className='p-2 rounded-lg shadow-red-100 bg-red-500 text-white  border border-red-500 hover:bg-white hover:text-red-600 '>
                          Negotiate Payment  
                        </button>
                    </Link>
                </div>


            </div>
        </div>
    );
};

export default MakePayment;
