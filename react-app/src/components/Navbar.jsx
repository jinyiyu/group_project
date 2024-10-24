import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { checkLoginStatus } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const { loginSuccess, user } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          HR Portal
        </Typography>

        {/*without login*/}
        {!loginSuccess && (
          <>
            <Button color="inherit" component={Link} to="/user/login">
              Login
            </Button>
            {/*<Button color="inherit" component={Link} to="/user/register/token123">*/}
            {/*    Register*/}
            {/*</Button>*/}
          </>
        )}

        {/*Nav for HR logged in */}
        {loginSuccess && user.role === "hr" && (
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
            <Button color="inherit" component={Link} to="/housing">
              Housing
            </Button>
            <Button color="inherit" component={Link} to="/logout">
              Logout
            </Button>
          </>
        )}

        {/*Nav for Employee logged in */}
        {loginSuccess && user.role === "employee" && (
          <>
            <Button color="inherit" component={Link} to="/application">
              Application
            </Button>
            <Button color="inherit" component={Link} to="/onboarding">
              On boarding
            </Button>
            <Button color="inherit" component={Link} to="/userVisaPage">
              User Visa Page
            </Button>
            <Button color="inherit" component={Link} to="/housing">
              Housing
            </Button>
            <Button color="inherit" component={Link} to="/logout">
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
