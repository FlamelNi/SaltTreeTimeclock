import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  // const [cookies, setCookies] = useCookies(["temp_key", "site_id"]);
  // const [temp_key, setTemp_key] = useState("");

  useEffect(() => {}, []);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
