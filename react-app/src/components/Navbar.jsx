import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";

// Hieu Tran NavBar
const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:5173/user/login";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          HR Portal
        </Typography>

        {/* If not authenticated, show Login button */}
        {!token && (
          <>
            <Button color="inherit" component={Link} to="/user/login">
              Login
            </Button>
          </>
        )}

        {/* Nav for HR logged in */}
        {token && user.role === "hr" && (
          <>
            <Button color="inherit" component={Link} to="/generateTokenForm">
              Generate Token Form
            </Button>
            <Button color="inherit" component={Link} to="/visaStatus">
              Visa Status
            </Button>
            <Button color="inherit" component={Link} to="/employeeSummaryView">
              Employee Summary View
            </Button>
            <Button color="inherit" component={Link} to="/application">
              Hiring
            </Button>
            <Button color="inherit" component={Link} to="/hrHousing">
              Housing
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}

        {/* Nav for Employee logged in */}
        {token && user.role === "employee" && (
          <>
            <Button color="inherit" component={Link} to="/onboarding">
              Onboarding
            </Button>
            <Button color="inherit" component={Link} to="/userVisaPage">
              User Visa Page
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
