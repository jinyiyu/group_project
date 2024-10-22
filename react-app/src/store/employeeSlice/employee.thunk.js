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
          responseType: "blob",
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

// Fetch Pending Documents
export const fetchPendingDocsThunk = createAsyncThunk(
  "employee/fetchPendingDocs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/employee/pending-docs"
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue("Failed to fetch pending documents.");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Function to update document status
export const updateWithFeedbackThunk = createAsyncThunk(
  "employee/update",
  async ({ _id, status, feedback = null }, thunkAPI) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/employee/update",
        {
          _id,
          status,
          feedback,
        }
      );
      if (response.data.success) {
        return {
          message: `Document status updated to ${status}`,
          data: response.data,
        };
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Visa Employees
export const fetchVisaEmployeesThunk = createAsyncThunk(
  "employee/fetchVisaEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/employee/visa-employees"
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue("Failed to fetch visa employees.");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
