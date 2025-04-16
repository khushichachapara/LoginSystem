import { Routes, Route } from 'react-router-dom';
import Home from '../assets/pages/Home.jsx';
import CreditorRegister from '../assets/pages/CreditorRegister.jsx';
import ConsumerLogin from '../assets/pages/ConsumerLogin.jsx';
import CreditorLogin from '../assets/pages/CreditorLogin.jsx';
import CrediitorDeshbord from '../assets/pages/CreditorDeshbord.jsx';
import DashbordConsumer from '../assets/pages/DashbordConsumer.jsx';


const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register/creditor" element={<CreditorRegister />} />
      <Route path="/login/consumer" element={<ConsumerLogin />} />
      <Route path="/login/creditor" element={<CreditorLogin />} />
      <Route path="/creditor/deshbord" element={<CrediitorDeshbord />} />
      <Route path="/consumer/deshbord" element={<DashbordConsumer />} />

    </Routes>
  );
};

export default RoutesApp;
