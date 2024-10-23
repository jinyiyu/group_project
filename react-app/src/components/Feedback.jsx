import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Box, Chip, Typography, Button, Input } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Feedback = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <Chip
        label={`Status: ${user.onboardStatus}`}
        color={user.onboardStatus == "pending" ? "info" : "warning"}
        sx={{ margin: "1vh" }}
      />

      {user.onboardStatus == "rejected" ? (
        <>
          <Stack sx={{ width: "100%" }}>
            {user.feedback.map((f, index) => (
              <Alert
                sx={{ margin: "0.5vh" }}
                key={index}
                variant="outlined"
                severity="warning"
              >
                {f}
              </Alert>
            ))}
          </Stack>
        </>
      ) : (
        <></>
      )}

      {user.onboardStatus == "pending" ? (
        <>
          <Alert variant="outlined" severity="info">
            Please wait for HR to review your application
          </Alert>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Feedback);
