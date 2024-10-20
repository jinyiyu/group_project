import EmailForm from "./utils/EmailJs";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OnBoarding from "./pages/onBoarding";

function App() {
  return (
    <>
      {/* component to send email from HR */}
      {/* <EmailForm /> */}

      {/* testing component for personal info and onboard application page */}
      {/* <OnBoarding></OnBoarding> */}
      <div>
        {/* component to send email from HR */}
        {/* <EmailForm /> */}
        <Router>
          <Routes>
            {/* Register page with token validation */}
            <Route path="user/register/:token" element={<Register />} />
            <Route path="user/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
