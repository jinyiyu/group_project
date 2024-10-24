import GenerateTokenForm from "./components/GenerateTokenForm";
import Application from "./components/Application";
import "./App.css";
import EmailForm from "./utils/EmailJs";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/navBar";
import VisaStatusManagementPage from "./components/VisaStatusHr.jsx";
import EmployeeSummaryView from "./pages/EmployeeSummaryView.jsx";
import UserVisaPage from "./pages/UserVisaPage.jsx";
import OnBoarding from "./pages/onBoarding.jsx";
import Housing from "./pages/Housing.jsx";
import HrHousingManagement from "./pages/HrHousing.jsx";

import Logout from "./components/Logout.jsx";
import { useSelector, useDispatch } from "react-redux";
import { checkLoginStatus } from "./redux/authSlice";

const AuthHOC = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const dispatch = useDispatch();

    const { loginSuccess, user } = useSelector((state) => state.userAuth);
    useEffect(() => {
      dispatch(checkLoginStatus());
    }, [dispatch]);
    if (!loginSuccess) {
      return <Navigate to="/user/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <p>Unauthorized role</p>; // or 401
    }

    return <WrappedComponent {...props} />;
  };
};

const LoginHOC = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const { loginSuccess } = useSelector((state) => state.userAuth);

    useEffect(() => {
      dispatch(checkLoginStatus());
    }, [dispatch]);

    if (loginSuccess) {
      return <Navigate to="/" />;
    }

    return <WrappedComponent {...props} />;
  };
};

// const RegisterHOC = (WrappedComponent) => {
//   return (props) => {
//     const { loginSuccess } = useSelector((state) => state.userAuth);

//     if (loginSuccess) {
//       return <Navigate to="/" />;
//     }

//     return <WrappedComponent {...props} />;
//   };
// }

function App() {
  const ProtectedOnBoarding = AuthHOC(OnBoarding, ["employee"]);
  const ProtectedHousing = AuthHOC(Housing, ["employee"]);
  const ProtectedEmployeeSummaryView = AuthHOC(EmployeeSummaryView, ["hr"]);
  const ProtectedVisaStatusManagementPage = AuthHOC(VisaStatusManagementPage, [
    "hr",
  ]);
  const ProtectedUserVisaPage = AuthHOC(UserVisaPage, ["employee"]);
  const ProtectedGenerateTokenForm = AuthHOC(GenerateTokenForm, ["hr"]);
  const ProtectedLogout = AuthHOC(Logout, ["hr"]);
  const ProtectedApplication = AuthHOC(Application, ["employee"]);
  // const ProtectedRegister = AuthHOC(Register, ["hr"]);
  const ProtectedLogin = LoginHOC(Login);
  const ProtectedHrHousingManagement = AuthHOC(HrHousingManagement, ["hr"]);

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
            <Route path="/" element={<p>Welcome</p>} />

            <Route path="user/login" element={<ProtectedLogin />} />
            <Route path="user/register/:token" element={<Register />} />

            <Route path="onboarding" element={<ProtectedOnBoarding />} />
            <Route path={"housing"} element={<ProtectedHousing />} />
            <Route path="userVisaPage" element={<ProtectedUserVisaPage />} />

            <Route path="application" element={<ProtectedApplication />} />
            <Route
              path="generateTokenForm"
              element={<ProtectedGenerateTokenForm />}
            />
            <Route
              path="visaStatus"
              element={<ProtectedVisaStatusManagementPage />}
            />
            <Route path="logout" element={<ProtectedLogout />} />
            <Route
              path="employeeSummaryView"
              element={<ProtectedEmployeeSummaryView />}
            />
            <Route
              path="hrHousing"
              element={<ProtectedHrHousingManagement />}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
