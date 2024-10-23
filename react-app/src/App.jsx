import GenerateTokenForm from "./components/GenerateTokenForm";
import Application from "./components/Application";
import "./App.css";
import EmailForm from "./utils/EmailJs";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/navBar";
import VisaStatusManagementPage from "./components/VisaStatusHr.jsx";
import EmployeeSummaryView from "./pages/EmployeeSummaryView.jsx";
import UserVisaPage from "./pages/UserVisaPage.jsx";
import OnBoarding from "./pages/onBoarding.jsx";
import Housing from "./pages/Housing.jsx";
import HrHousingManagement from "./pages/HrHousing.jsx";

function App() {
  return (
    <>
      {/* testing component for personal info and onboard application page */}
      {/* <OnBoarding></OnBoarding> */}
      <div>
        {/* generate token  */}
        {/* <GenerateTokenForm /> <br /> */}
        {/* application component */}
        {/* <Application /> <br /> */}
        {/* <HrHousingManagement /> */}
        {/* Commented out for readability purposes */}
        <Router>
          <Navbar />
          <Routes>
            {/* Register page with token validation */}
            <Route path="/" element={<p>Welcome</p>} />
            <Route path="user/register/:token" element={<Register />} />
            <Route path="user/login" element={<Login />} />
            <Route path="onboarding" element={<OnBoarding />} />
            <Route path="application" element={<Application />} />
            <Route path="generateTokenForm" element={<GenerateTokenForm />} />
            <Route path="visaStatus" element={<VisaStatusManagementPage />} />
            <Route path="hrHousing" element={<HrHousingManagement />} />
            {/* <EmployeeSummaryView /> */}
            <Route
              path="employeeSummaryView"
              element={<EmployeeSummaryView />}
            />
            {/* <Housing /> */}
            <Route path={"housing"} element={<Housing />} />
            {/* <UserVisaPage /> */}
            <Route path="userVisaPage" element={<UserVisaPage />} />
            {/* <OnBoarding /> */}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
