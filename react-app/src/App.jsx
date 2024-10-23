import GenerateTokenForm from "./components/GenerateTokenForm";
import Application from "./components/Application";
import "./App.css";
import EmailForm from "./utils/EmailJs";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OnBoarding from "./pages/onBoarding";
import HrHousingManagement from "./pages/HrHousing";

function App() {
  return (
    <>
      {/* component to send email from HR */}
      {/* <EmailForm /> */}

      {/* testing component for personal info and onboard application page */}
      {/* <OnBoarding></OnBoarding> */}
      <div>
        {/* generate token  */}
        {/* <GenerateTokenForm /> <br /> */}
        {/* application component */}
        {/* <Application /> <br /> */}
        <HrHousingManagement />
        {/* Commented out for readability purposes */}
        {/* component to send email from HR */}
        {/* <EmailForm /> */}
        <Router>
          <Routes>
            {/* Register page with token validation */}
            {/* <Route path="user/register/:token" element={<Register />} />
            <Route path="user/login" element={<Login />} /> */}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
