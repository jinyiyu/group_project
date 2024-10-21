import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import OnBoarding from "./pages/onBoarding";

import App from "./App.jsx"
import store from "./store/index.js";
// import EmployeeSummaryView from "./components/employeeSummaryView.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <EmployeeSummaryView /> */}
      <OnBoarding></OnBoarding>
    </Provider>
  </StrictMode>
);
