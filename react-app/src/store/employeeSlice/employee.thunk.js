// housing.thunk.js
import { setEmployees } from "./employeeSlice";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployees = () => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:3000/employee/profile");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const employees = await response.json();
    dispatch(setEmployees(employees));
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
};

export const previewDocumentThunk = createAsyncThunk(
  "files/documentTemplate",
  async (documentS3Path, thunkAPI) => {
    try {
      const response = await axios.get(
        `/download-document?filePath=documents/documentId/Group_Project.pdf`,
        {
          responseType: "blob", // Make sure the response is handled as a file
        }
      );

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `testFile.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element

      return `${templateType}_template.pdf downloaded successfully`;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
