import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { useEffect, useState } from "react";
import { get_all_employees } from "./firestore";
import { useCookies } from "react-cookie";
import Axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserReport from "./pages/UserReport/UserReport";
import UserClockPage from "./pages/UserClockPage/UserClockPage";
import { Employee } from "./datatype";

function App() {
  // const [cookies, setCookies] = useCookies(["temp_key", "site_id"]);
  // const [temp_key, setTemp_key] = useState("");
  const [employeeList, setEmployeeList] = useState([] as Employee[]);

  useEffect(() => {
    get_all_employees().then(setEmployeeList);
  }, []);

  useEffect(() => {
    console.log(employeeList);
  }, [employeeList]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<UserReport />} />
      <Route path="/test2" element={<UserClockPage />} />
    </Routes>
  );
}

export default App;
