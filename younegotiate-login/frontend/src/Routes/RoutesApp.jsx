import { Routes, Route } from 'react-router-dom';
import Home from '../assets/pages/Home.jsx';
import CreditorRegister from '../assets/pages/CreditorRegister.jsx';
import ConsumerLogin from '../assets/pages/ConsumerLogin.jsx';
import CreditorLogin from '../assets/pages/CreditorLogin.jsx';


const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register/creditor" element={<CreditorRegister />} />
      <Route path="/login/consumer" element={<ConsumerLogin />} />
      <Route path="/login/creditor" element={<CreditorLogin />} />

    </Routes>
  );
};

export default RoutesApp;
