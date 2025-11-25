import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Toast, { showToast } from "../components/Toast";
import * as apiClient from '../api-client';

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userId: string | undefined;
  isAdmin: boolean;
};

// ✅ Keep this helper function here at the top (before AppContext)
const getCookieConsent = () => {
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) return null;
  
  try {
    return JSON.parse(consent);
  } catch {
    return { accepted: consent === "accepted" };
  }
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Use the consent checker in the useQuery
  const { isError, data } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    enabled: getCookieConsent()?.accepted === true, // Only validate if consent given
  });

  const userId = data?.userId;
  const isAdmin = data?.isAdmin;

  // Update isLoggedIn based on the query result
  useEffect(() => {
    setIsLoggedIn(!isError && getCookieConsent()?.accepted === true);
  }, [isError]);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          showToast(toastMessage.message, toastMessage.type);
        },
        isLoggedIn: isLoggedIn,
        setLoggedIn: setIsLoggedIn,
        userId: userId,
        isAdmin: isAdmin,
      }}
    >
      <Toast />
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};