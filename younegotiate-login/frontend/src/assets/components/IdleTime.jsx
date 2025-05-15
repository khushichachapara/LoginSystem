import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useIdleTimer = () => {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();
  let timer;

  useEffect(() => {
    // Function to reset the idle timer on any user activity
    const resetTimer = () => {
      clearTimeout(timer); // Reset the timeout
      timer = setTimeout(() => {
        setIsIdle(true); // Set user as idle after 15 minutes
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        navigate("/login/creditor"); // Redirect to login
      }, 15 * 60 * 1000); // 15 minutes in milliseconds
    };

    // Add event listeners to reset the timer on user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    // Initial call to start the timer
    resetTimer();

    return () => {
      // Cleanup event listeners and timer on component unmount
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timer);
    };
  }, [navigate]);

  return isIdle;
};

export default useIdleTimer;
