import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

const StatusSwitch = ({ status, onChangeStatus }) => {
  const isChecked = status === "open" || status === "In Progress";
  const getLabel = (currentStatus) => {
    switch (currentStatus) {
      case "open":
        return "open";
      case "In Progress":
        return "In Progress";
      case "closed":
        return "closed";
      default:
        return "open";
    }
  };

  const handleChange = () => {
    const nextStatus = status === "closed" ? "open" : "closed";

    onChangeStatus(nextStatus);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isChecked} // Switch will be ON for In Progress or closed
          onChange={handleChange}
        />
      }
      label={getLabel(status)} // Dynamic label based on current status
    />
  );
};

export default StatusSwitch;
