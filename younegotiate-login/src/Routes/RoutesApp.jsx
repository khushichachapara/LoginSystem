import { Routes, Route } from 'react-router-dom';
import Home from '../assets/pages/Home.jsx';

// import CreditorLogin from '../assets/pages/CreditorLogin.jsx';
// import ConsumerLogin from '../assets/pages/ConsumerLogin.jsx';
// add more as needed

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/creditor-login" element={<CreditorLogin />} />
      <Route path="/consumer-login" element={<ConsumerLogin />} /> */}
    </Routes>
  );
};

export default RoutesApp;
