import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");
    const error = params.get("error");

    if (error) {
      showToast({ message: error, type: "ERROR" });
      navigate("/sign-in");
      return;
    }

    if (userId && email) {
      // Store user info in sessionStorage for immediate context update
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("email", email);
      if (firstName) sessionStorage.setItem("firstName", firstName);
      if (lastName) sessionStorage.setItem("lastName", lastName);

      showToast({ message: "Login successful!", type: "SUCCESS" });
      
      // Give the context a moment to refresh the session
      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      showToast({ message: "Authentication failed", type: "ERROR" });
      navigate("/sign-in");
    }
  }, [navigate, showToast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Logging you in...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
