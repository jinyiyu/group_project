import UploadForm from "./UploadForm";
import { useState } from "react";
import { Typography, Box, CardContent } from "@mui/material";

const OPTReceipt = ({ status, feedback, onFileUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadSuccess = () => {
    setIsUploading(false); // File upload success
    onFileUploadComplete(); // Trigger the status refresh in the parent
  };
  return (
    <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" mb={2}>
          Visa Status Details
        </Typography>
        {status === "Pending" && (
          <Typography mb={6}>
            Waiting for HR to approve your OPT Receipt.
          </Typography>
        )}
        {status === "Approved" && (
          <>
            <Typography mb={6}>
              Please upload a copy of your OPT EAD.
            </Typography>
            <UploadForm
              documentType="OPT_EAD"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
        {status === "Rejected" && (
          <>
            <Typography mb={6}>HR Feedback: {feedback}</Typography>

            <UploadForm
              documentType="OPT_receipt"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
      </Box>
    </CardContent>
  );
};

export default OPTReceipt;
