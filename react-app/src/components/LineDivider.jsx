import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Chip, Divider, InputLabel } from "@mui/material";

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
