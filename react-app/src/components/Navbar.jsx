import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          HR Portal
        </Typography>
        <Button color="inherit" component={Link} to="/user/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/user/register/token123">
          Register
        </Button>
        <Button color="inherit" component={Link} to="/onboarding">
          Onboarding
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
