import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  checkLoginStatus,
  getUserOnboardStatus,
} from "../store/authSlice/authSlice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, onboardStatus } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    dispatch(checkLoginStatus());
    // if (user && user.role === "employee") {
    dispatch(getUserOnboardStatus());
    // }
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {/*HR Portal*/}
          {isAuthenticated
            ? user.role === "hr"
              ? "HR Portal"
              : "Employee Portal"
            : "Welcome, Please login"}
        </Typography>

        {/* If not authenticated, show Login button */}
        {!isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/user/login">
              Login
            </Button>
          </>
        )}

        {/* Nav for HR logged in */}
        {isAuthenticated && user.role === "hr" && (
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
            <Button color="inherit" component={Link} to={"/user/logout"}>
              Logout
            </Button>
          </>
        )}

        {/* Nav for Employee logged in */}
        {isAuthenticated && user.role === "employee" && (
          <>
            {onboardStatus !== "Approved" && (
              <>
                <Button color="inherit" component={Link} to="/onboarding">
                  Onboarding
                </Button>
                <Button color="inherit" component={Link} to="/userVisaPage">
                  User Visa Page
                </Button>
              </>
            )}

            {/* only show when user.onboardStatus == approved */}
            {onboardStatus === "Approved" || onboardStatus === "approved" && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/personalInformation"
                >
                  Personal Information
                </Button>
                <Button color="inherit" component={Link} to="/housing">
                  Housing
                </Button>
              </>
            )}

            <Button color="inherit" component={Link} to={"/user/logout"}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
