import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store/store.js";
import EmployeeSummaryView from "./pages/EmployeeSummaryView.jsx";
import VisaStatusManagementPage from "./components/VisaStatusHr.jsx";
import ApplicationReview from "./components/Application.jsx";
import UserVisaPage from "./pages/UserVisaPage.jsx";
import Housing from "./pages/Housing.jsx";
import OnBoarding from "./pages/onBoarding.jsx";
import PersonalInformation from "./pages/PersonalInformation.jsx";
import Modal from "react-modal";
Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <EmployeeSummaryView /> */}
      {/* <VisaStatusManagementPage /> */}
      {/* <Housing /> */}
      {/* <UserVisaPage /> */}
      {/* <OnBoarding /> */}
      {/* <PersonalInformation /> */}
    </Provider>
  // </StrictMode>
);
