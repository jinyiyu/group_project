import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store/store.js";
// import EmployeeSummaryView from "./components/employeeSummaryView.jsx";
import UserVisaPage from "./pages/UserVisaPage.jsx";
import Modal from "react-modal";
Modal.setAppElement("#root");
import Housing from "./pages/Housing.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <EmployeeSummaryView /> */}
      <Housing />
      {/* <UserVisaPage /> */}
    </Provider>
  </StrictMode>
);
