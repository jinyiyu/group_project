import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
<<<<<<< HEAD
import OnBoarding from "./pages/onBoarding";

import App from "./App.jsx"
import store from "./store/index.js";
// import EmployeeSummaryView from "./components/employeeSummaryView.jsx";
=======
import App from "./App.jsx";
import store from "./store/store.js";
import EmployeeSummaryView from "./components/employeeSummaryView.jsx";
import UserVisaPage from "./pages/UserVisaPage.jsx";
import Modal from "react-modal";
Modal.setAppElement("#root");
import Housing from "./pages/Housing.jsx";
import OnBoarding from "./pages/onBoarding.jsx";
>>>>>>> main

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <EmployeeSummaryView /> */}
<<<<<<< HEAD
      <OnBoarding></OnBoarding>
=======
      {/* <Housing /> */}
      {/* <UserVisaPage /> */}
      {/* <OnBoarding /> */}
>>>>>>> main
    </Provider>
  </StrictMode>
);
