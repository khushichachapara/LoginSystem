import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 Import BrowserRouter
import { Bounce, ToastContainer, Zoom } from 'react-toastify'
import { ErrorBoundary } from "react-error-boundary";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 👈 Wrap App inside */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
        
      />
    <ErrorBoundary fallback={<div  className='w-full h-screen flex justify-center items-center'><h1 className=' text-red-400 font-bold text-4xl'>somthing went wrong ⚠️</h1></div>}> 
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
