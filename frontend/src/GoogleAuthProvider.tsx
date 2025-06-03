import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

interface AuthContextProps {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialization from localStorage for persistent login
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const loggedInUser = {
        id: userInfo.data.sub,
        name: userInfo.data.name,
        email: userInfo.data.email,
        accessToken: access_token,
      };
      setUser(loggedInUser);
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));

      console.log("Logged in as:", userInfo.data);
    },
    scope: "https://www.googleapis.com/auth/calendar",
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AppWithAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
};
