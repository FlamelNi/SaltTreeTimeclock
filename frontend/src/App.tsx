import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserReport from "./pages/UserReport/UserReport";
import UserClockPage from "./pages/UserClockPage/UserClockPage";

function App() {
  // const [cookies, setCookies] = useCookies(["temp_key", "site_id"]);
  // const [temp_key, setTemp_key] = useState("");

  useEffect(() => {}, []);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<UserReport />} />
      <Route path="/test2" element={<UserClockPage />} />
    </Routes>
  );
}

export default App;
