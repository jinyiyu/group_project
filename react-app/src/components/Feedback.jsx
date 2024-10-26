import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Alert, Chip, Stack } from "@mui/material";

const Feedback = () => {
  const user = useSelector((state) => state.user);
  const getColor = {
    pending: "info",
    "not started": "info",
    rejected: "warning",
    approved: "success",
  };

  return (
    <>
      <Chip
        label={`Status: ${user.onboardStatus}`}
        color={getColor[user.onboardStatus]}
        sx={{ margin: "1vh", fontSize: "2vh", borderRadius: "1vh" }}
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
