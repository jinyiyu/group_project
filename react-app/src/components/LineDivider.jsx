import React from "react";
import { Chip, Divider } from "@mui/material";

const LineDivider = ({ label }) => {
  return (
    <Divider
      sx={{
        "&::before, &::after": {
          borderColor: "rgb(179,223,252)",
          borderWidth: "3px",
          borderRadius: "5px",
        },
        mt: "5vh",
        mb: "3vh",
      }}
    >
      <Chip
        variant="outlined"
        label={label}
        color="info"
        sx={{ fontSize: "2vh" }}
      />
    </Divider>
  );
};

export default LineDivider;
