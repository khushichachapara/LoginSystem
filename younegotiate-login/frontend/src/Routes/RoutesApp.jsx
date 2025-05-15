import { Routes, Route } from 'react-router-dom';
import Home from '../assets/pages/Home.jsx';
import CreditorRegister from '../assets/pages/CreditorRegister.jsx';
import ConsumerLogin from '../assets/pages/ConsumerLogin.jsx';
import CreditorLogin from '../assets/pages/CreditorLogin.jsx';
import CreditorDashboard from '../assets/pages/CreditorDashboard.jsx';
import DashboardConsumer from '../assets/pages/DashboardConsumer.jsx';
import PaymentTerms from '../assets/pages/PaymentTerms.jsx';
import CreateConsumer from '../assets/pages/CreateConsumer.jsx';
//import DashbordConsumer from '../assets/pages/DashboardConsumer.jsx';
import ProtectedRoutes from '../assets/components/ProtectedRoutes.jsx';
import  CardDetails from '../assets/pages/CardDetails.jsx';
import ProtectedRoutesConsumer from '../assets/components/ProtectedRoutesConsumer.jsx';
import MakePayment from '../assets/pages/MakePayment.jsx';
import NegotiateTerms from '../assets/pages/CreditorNegotiate.jsx';
import ConsumerNegotiation from '../assets/pages/ConsumerNegotiation.jsx';


const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register/creditor" element={<CreditorRegister />} />
      <Route path="/login/consumer" element={<ConsumerLogin />} />
      <Route path="/login/creditor" element={<CreditorLogin />} />


      <Route path="/creditor/dashboard" element={<ProtectedRoutes element={<CreditorDashboard />} />}/>
      <Route path ="/paymentTerms" element={<ProtectedRoutes  element={<PaymentTerms />} />}/>
      <Route path="/CreateConsumer" element={<ProtectedRoutes element={<CreateConsumer />} />}/>
      <Route path="/consumer/dashboard/:id" element={<ProtectedRoutesConsumer element={<DashboardConsumer />} />}/>
      <Route path ="/consumer/dashboard" element={<ProtectedRoutesConsumer element={<DashboardConsumer/>}/>}/>
      <Route path="/cardDetails/:id" element={<ProtectedRoutes element={<CardDetails />} />}/>
      <Route path ='/makepayment/:id' element={<ProtectedRoutesConsumer element={<MakePayment/>}/>}/>
      <Route path ="/negotiation-requests/Creditor" element={<ProtectedRoutes element={<NegotiateTerms/>}/>}/>
      <Route path ='/negotiation-request/consumer/:id' element={<ProtectedRoutesConsumer element={<ConsumerNegotiation/>}/>}/>
    </Routes>
  );
};

export default RoutesApp;
