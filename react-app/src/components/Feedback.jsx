import React, { memo } from "react";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Feedback = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <h1>{`Status: ${user.onboardStatus}`}</h1>

      {user.onboardStatus == "rejected" ? (
        <>
          <Stack sx={{ width: "100%" }} spacing={1}>
            <h1>Feedbacks: </h1>
            {user.feedback.map((f, index) => (
              <Alert key={index} variant="filled" severity="info">
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
          <h1>Please wait for HR to review your application</h1>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Feedback);
