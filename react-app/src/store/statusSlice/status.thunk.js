import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const VisaStatusThunk = createAsyncThunk(
  "userStatus/VisaStatusThunk",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/user/status");

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadFileThunk = createAsyncThunk(
  "documents/uploadFile",
  async ({ file, documentType }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.put(
        `/users/upload?type=${documentType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.updated;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

export const fetchI983TemplateThunk = createAsyncThunk(
  "files/fetchI983Template",
  async (templateType, thunkAPI) => {
    try {
      const response = await axios.get(`/users/download/${templateType}`, {
        responseType: "blob", // Make sure the response is handled as a file
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${templateType}_template.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element

      return `${templateType}_template.pdf downloaded successfully`;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
