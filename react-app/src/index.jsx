import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx"
import store from "./store/index.js";
// import EmployeeSummaryView from "./components/employeeSummaryView.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      {/* <EmployeeSummaryView /> */}
    </Provider>
  </StrictMode>
);
