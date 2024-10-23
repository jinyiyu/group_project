import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileThunk } from "../../store/statusSlice/status.thunk";
import {
  selectUploadedDocument,
  selectIsLoading,
} from "../../store/statusSlice/file.selectors";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadForm = ({ documentType, onUploadStart, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const uploadedDocument = useSelector(selectUploadedDocument);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUploadStart(); // Notify the parent component that the upload started
      dispatch(uploadFileThunk({ file: selectedFile, documentType }))
        .unwrap()
        .then(() => {
          onUploadSuccess(); // Notify the parent component that the upload is successful
        })
        .catch((error) => {
          console.error("File upload failed:", error);
        });
    }
  };

  return (
    <Box
      mt={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="h6">Plase upload your {documentType}</Typography>

      <Box mt={4} display="flex" alignItems="center">
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file">
          <Button variant="outlined" component="span" disabled={isLoading}>
            Choose File
          </Button>
        </label>

        <Typography sx={{ mx: 2 }}>
          {selectedFile ? selectedFile.name : "No file chosen"}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              {isLoading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ position: "absolute", top: 0, left: 0 }}
                />
              ) : (
                <CloudUploadIcon />
              )}
            </Box>
          }
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          sx={{ ml: 1 }}
        >
          {isLoading ? <Box>Uploading...</Box> : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};

export default UploadForm;
