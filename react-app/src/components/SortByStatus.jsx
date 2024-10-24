import React from "react";
import { Box, Radio, RadioGroup, FormControlLabel } from "@mui/material";

const SortByStatus = ({ statusFilter, setStatusFilter }) => {
  // Handler for changing the status filter
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <RadioGroup row value={statusFilter} onChange={handleStatusChange}>
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="open" control={<Radio />} label="Open" />
        <FormControlLabel value="closed" control={<Radio />} label="Closed" />
        <FormControlLabel
          value="In Progress"
          control={<Radio />}
          label="In Progress"
        />
      </RadioGroup>
    </Box>
  );
};

export default SortByStatus;
