import { BrowserRouter, Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserReport from "./pages/UserReport/UserReport";
import UserClockPage from "./pages/UserClockPage/UserClockPage";
import { Employee } from "./datatype";

function getCurrentUser(): Employee | null {
  try {
    const data = window.localStorage.getItem("currentUser");
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, adminOnly = false }: { children: JSX.Element; adminOnly?: boolean }) {
  const user = getCurrentUser();
  const location = useLocation();
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/userclockpage" replace />;
  if (!adminOnly && user.is_admin) return <Navigate to="/userreport" replace />;
  return children;
}

function App() {
  const [currUser, setCurrUser] = useState<Employee | null>(getCurrentUser());
  const navigate = useNavigate();

  // Handle storage updates across tabs/windows
  useEffect(() => {
    const onStorage = () => setCurrUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Login/out helpers to update session
  const handleLogout = () => {
    window.localStorage.removeItem("currentUser");
    setCurrUser(null);
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={currUser ? currUser.is_admin ? <Navigate to="/report" replace /> : <Navigate to="/clockpage" replace /> : <LandingPage />}
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute adminOnly>
            <UserReport curr_user={currUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clockpage"
        element={
          <ProtectedRoute>
            <UserClockPage curr_user={currUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
