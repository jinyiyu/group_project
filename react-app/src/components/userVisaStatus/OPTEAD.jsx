import UploadForm from "./UploadForm";
import Template from "./Template";
import { useState } from "react";
import { Typography, Box, CardContent } from "@mui/material";

const OPTEAD = ({ status, feedback, onFileUploadComplete }) => {
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
            Waiting for HR to approve your OPT EAD.
          </Typography>
        )}
        {status === "Approved" && (
          <>
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
        {status === "Rejected" && (
          <>
            <Typography mb={6}>HR Feedback: {feedback}</Typography>

            <UploadForm
              documentType="OPT_EAD"
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
            />
          </>
        )}
      </Box>
    </CardContent>
  );
};

export default OPTEAD;
