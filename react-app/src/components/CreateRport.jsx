import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createReportThunk } from "../store/reportSlice/report.thunk";
import { Box, Typography, Button, TextField } from "@mui/material";

const CreateReport = () => {
  const dispatch = useDispatch();
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportDesc, setNewReportDesc] = useState("");

  // Handler for creating a new report
  const handleCreateReport = (e) => {
    e.preventDefault();
    const newReport = {
      title: newReportTitle,
      desc: newReportDesc,
    };
    dispatch(createReportThunk(newReport));
    setNewReportTitle("");
    setNewReportDesc("");
  };

  return (
    <Box>
      <Typography variant="h5" mb={2} mt={2}>
        Create a New Report
      </Typography>
      <form onSubmit={handleCreateReport}>
        {[
          {
            label: "Title",
            value: newReportTitle,
            onChange: setNewReportTitle,
          },
          {
            label: "Description",
            value: newReportDesc,
            onChange: setNewReportDesc,
            multiline: true,
          },
        ].map((field, index) => (
          <Box mb={2} key={index} sx={{ "& > :not(style)": { m: 1 } }}>
            {field.multiline ? (
              <TextField
                label={field.label}
                variant="standard"
                multiline
                placeholder=""
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                required
              />
            ) : (
              <TextField
                multiline
                label={field.label}
                variant="standard"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                required
              />
            )}
          </Box>
        ))}
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateReport;
