import UploadForm from "./UploadForm";
import { useState } from "react";
import { Typography, Box, CardContent } from "@mui/material";
const I20 = ({ status, feedback, onFileUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadSuccess = () => {
    setIsUploading(false);
    onFileUploadComplete();
  };
  return (
    <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" mb={2}>
          Visa Status Details
        </Typography>
        {status === "Pending" && (
          <Typography mb={6}>Waiting for HR to approve your I-20.</Typography>
        )}
        {status === "Approved" && (
          <Typography mb={6}>All documents have been approved.</Typography>
        )}
        {status === "Rejected" && (
          <>
            <Typography mb={6}>HR Feedback: {feedback}</Typography>
            <UploadForm
              documentType="I_20"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
      </Box>
    </CardContent>
  );
};
export default I20;
