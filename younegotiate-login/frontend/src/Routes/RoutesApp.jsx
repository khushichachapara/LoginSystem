import { Routes, Route } from 'react-router-dom';
import Home from '../assets/pages/Home.jsx';
import CreditorRegister from '../assets/pages/CreditorRegister.jsx';
import ConsumerLogin from '../assets/pages/ConsumerLogin.jsx';
import CreditorLogin from '../assets/pages/CreditorLogin.jsx';
import CreditorDashboard from '../assets/pages/CreditorDashboard.jsx';
import DashboardConsumer from '../assets/pages/DashboardConsumer.jsx';
import PaymentTerms from '../assets/pages/PaymentTerms.jsx';
import CreateConsumer from '../assets/pages/CreateConsumer.jsx';


const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register/creditor" element={<CreditorRegister />} />
      <Route path="/login/consumer" element={<ConsumerLogin />} />
      <Route path="/login/creditor" element={<CreditorLogin />} />
      <Route path="/creditor/dashboard" element={<CreditorDashboard />} />
      <Route path ="/paymentTerms" element={<PaymentTerms />} />
      <Route path="/CreateConsumer" element={<CreateConsumer />} />
      <Route path="/consumer/dashboard" element={<DashboardConsumer />} />
      

    </Routes>
  );
};

export default RoutesApp;
