import EmailForm from "./utils/EmailJs";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"; 

function App() {
    return (
        <>
            <div>
                {/* component to send email from HR */}
                {/* <EmailForm /> */}
                <Router>
                    <Routes>
                        {/* Register page with token validation */}
                        <Route path="/register/:token" element={<Register />} />
                        {/* Login page */}
                        <Route path="/login" element={<Login />} />
</Routes>
                </Router>
            </div>
        </>
    );
}

export default App;
