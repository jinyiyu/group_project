// import GenerateTokenForm from "./components/GenerateTokenForm";
// import Application from "./components/Application";
// // import "./App.css";
// import EmailForm from "./utils/EmailJs";
// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Navbar from "./components/navBar";
// import VisaStatusManagementPage from "./components/VisaStatusHr.jsx";
// import EmployeeSummaryView from "./pages/EmployeeSummaryView.jsx";
// import UserVisaPage from "./pages/UserVisaPage.jsx";
// import OnBoarding from "./pages/onBoarding.jsx";
// import Housing from "./pages/Housing.jsx";
// import Logout from "./components/Logout.jsx";
// import { useSelector, useDispatch } from "react-redux";
// import { checkLoginStatus } from "./redux/authSlice";
//
// const AuthHOC = (WrappedComponent, allowedRoles) => {
//   return (props) => {
//     const dispatch = useDispatch();
//
//     const { loginSuccess, user } = useSelector((state) => state.userAuth);
//     useEffect(() => {
//       dispatch(checkLoginStatus());
//     }, [dispatch]);
//     if (!loginSuccess) {
//       return <Navigate to="/user/login" />;
//     }
//
//     if (!allowedRoles.includes(user.role)) {
//       return <p>Unauthorized role</p>; // or 401
//     }
//
//     return <WrappedComponent {...props} />;
//   };
// };
//
// const LoginHOC = (WrappedComponent) => {
//   return (props) => {
//     const dispatch = useDispatch();
//     const { loginSuccess } = useSelector((state) => state.userAuth);
//
//     useEffect(() => {
//       dispatch(checkLoginStatus());
//     }, [dispatch]);
//
//     if (loginSuccess) {
//       return <Navigate to="/" />;
//     }
//
//     return <WrappedComponent {...props} />;
//   };
// }
//
// const RegisterHOC = (WrappedComponent) => {
//   return (props) => {
//     const { loginSuccess } = useSelector((state) => state.userAuth);
//
//     if (loginSuccess) {
//       return <Navigate to="/" />;
//     }
//
//     return <WrappedComponent {...props} />;
//   };
// }
//
// function App() {
//   const ProtectedOnBoarding = AuthHOC(OnBoarding, ["employee"]);
//   const ProtectedHousing = AuthHOC(Housing, ["employee"]);
//   const ProtectedEmployeeSummaryView = AuthHOC(EmployeeSummaryView, ["hr"]);
//   const ProtectedVisaStatusManagementPage = AuthHOC(VisaStatusManagementPage, [
//     "hr",
//   ]);
//   const ProtectedUserVisaPage = AuthHOC(UserVisaPage, ["employee"]);
//   const ProtectedGenerateTokenForm = AuthHOC(GenerateTokenForm, ["hr"]);
//   const ProtectedLogout = AuthHOC(Logout, ["hr", "employee"]);
//   const ProtectedApplication = AuthHOC(Application, ["employee"]);
//   // const ProtectedRegister = AuthHOC(Register, ["hr"]);
//   const ProtectedLogin = LoginHOC(Login);
//
//
//
//   return (
//       <>
//         <div>
//           <Router>
//             <Navbar />
//             <Routes>
//               <Route path="/" element={<p>Welcome</p>} />
//
//               <Route path="user/login" element={<ProtectedLogin />} />
//               <Route path="user/register/:token" element={<Register />} />
//
//               <Route path="onboarding" element={<ProtectedOnBoarding/>} />
//               <Route path={"housing"} element={<ProtectedHousing />} />
//               <Route path="userVisaPage" element={<ProtectedUserVisaPage />} />
//
//               <Route path="application" element={<ProtectedApplication />} />
//               <Route path="generateTokenForm" element={<ProtectedGenerateTokenForm />} />
//               <Route path="visaStatus" element={<ProtectedVisaStatusManagementPage />} />
//               <Route path="logout" element={<ProtectedLogout />} />
//               <Route
//                   path="employeeSummaryView"
//                   element={<ProtectedEmployeeSummaryView />}
//               />
//             </Routes>
//           </Router>
//         </div>
//       </>
//   );
// }
//
// export default App;

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
import PersonalInformation from "./pages/PersonalInformation.jsx";
import Housing from "./pages/Housing.jsx";
import HrHousingManagement from "./pages/HrHousing.jsx";
import { useSelector, useDispatch } from "react-redux";
import { checkLoginStatus } from "./redux/authSlice";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Logout from "./components/Logout.jsx";
const LoginHOC = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const { isAuthenticated,  user} = useSelector((state) => state.userAuth);

    useEffect(() => {
      dispatch(checkLoginStatus());
    }, [dispatch]);

    if (isAuthenticated) {
      if (user.role === "hr") {
        return <Navigate to="/generateTokenForm" />;
      } else if (user.role === "employee") {
        return <Navigate to="/onboarding" />;
      }
    }

    return <WrappedComponent {...props} />;
  };
}

const AuthHOC = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.userAuth);
    useEffect(() => {
      dispatch(checkLoginStatus());
    }, [dispatch]);
    if (!isAuthenticated) {
      return <Navigate to="/user/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <p>Unauthorized role</p>; // or 401
    }

    return <WrappedComponent {...props} />;
  };
};

const Home = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.userAuth);
    useEffect(() => {
        dispatch(checkLoginStatus());
    }, [dispatch]);
    if (!isAuthenticated) {
        return <Navigate to="/user/login" />;
    }
    if (user.role === "hr") {
        return <Navigate to="/generateTokenForm" />;
    } else if (user.role === "employee") {
        return <Navigate to="/onboarding" />;
    }
}

function App() {
    const ProtectedLogin = LoginHOC(Login);
    const ProtectedLogout = AuthHOC(Logout, ["hr", "employee"]);
    const ProtectedOnBoarding = AuthHOC(OnBoarding, ["employee"]);
    // personal information page
    const ProtectedPersonalInformation = AuthHOC(PersonalInformation, ["employee"]);
    //housing
    const ProtectedHousing = AuthHOC(Housing, ["employee"]);
    // user visa page
    const ProtectedUserVisaPage = AuthHOC(UserVisaPage, ["employee"]);

    // hr
  //generate token form
    const ProtectedGenerateTokenForm = AuthHOC(GenerateTokenForm, ["hr"]);
    //visa status
    const ProtectedVisaStatusManagementPage = AuthHOC(VisaStatusManagementPage, [
      "hr",
    ]);
    //employee summary view
    const ProtectedEmployeeSummaryView = AuthHOC(EmployeeSummaryView, ["hr"]);
    //application
    const ProtectedApplication = AuthHOC(Application, ["hr"]);
    //hr housing
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
            {/* Register page with token validation */}
            <Route path="/" element={<Home/>} />
            <Route path="user/register/:token" element={<Register />} />
            <Route path="user/login" element={<ProtectedLogin />} />
            <Route path="onboarding" element={<ProtectedOnBoarding />} />
            <Route
              path="personalInformation"
              element={<ProtectedPersonalInformation />}
            />
            <Route path="application" element={<ProtectedApplication />} />
            <Route path="generateTokenForm" element={<ProtectedGenerateTokenForm />} />
            <Route path="visaStatus" element={<ProtectedVisaStatusManagementPage />} />
            <Route path="hrHousing" element={<ProtectedHrHousingManagement />} />
            {/* <EmployeeSummaryView /> */}
            <Route
              path="employeeSummaryView"
              element={<ProtectedEmployeeSummaryView />}
            />
            {/* <Housing /> */}
            <Route path={"housing"} element={<ProtectedHousing />} />
            {/* <UserVisaPage /> */}
            <Route path="userVisaPage" element={<ProtectedUserVisaPage />} />
            {/* <OnBoarding /> */}
              <Route path="/user/logout" element={<ProtectedLogout />} />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
