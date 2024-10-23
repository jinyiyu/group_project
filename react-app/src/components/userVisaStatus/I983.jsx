import UploadForm from "./UploadForm";
import { useState } from "react";
import Template from "./Template";
import { Typography, Box, CardContent } from "@mui/material";
const I983 = ({ status, feedback, onFileUploadComplete }) => {
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
          <Typography mb={6}>
            Waiting for HR to approve and sign your I-983.
          </Typography>
        )}
        {status === "Approved" && (
          <>
            <Typography mb={6}>
              Please send the I-983 to your school and upload the new I-20.
            </Typography>
            <UploadForm
              documentType="I_20"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
        {status === "Rejected" && (
          <>
            <Typography mb={6}>HR Feedback: {feedback}</Typography>
            <Typography mb={4}>
              Please download and fill out the I-983 form.
            </Typography>
            <Template />
            <UploadForm
              documentType="I_983"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
      </Box>
    </CardContent>
  );
};
export default I983;
