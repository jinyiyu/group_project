import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Card, Stepper, Step, StepLabel } from "@mui/material";
import { VisaStatusThunk } from "../store/statusSlice/status.thunk";
import {
  selectDocumentType,
  selectDocumentStatus,
  selectFeedback,
} from "../store/statusSlice/status.selectors";
import OPTReceipt from "../components/userVisaStatus/OPTReceipt";
import OPTEAD from "../components/userVisaStatus/OPTEAD";
import I983 from "../components/userVisaStatus/I983";
import I20 from "../components/userVisaStatus/I20";
const steps = ["OPT_receipt", "OPT_EAD", "I_983", "I_20"];

const UserVisaPage = () => {
  const dispatch = useDispatch();
  const documentType = useSelector(selectDocumentType);
  const status = useSelector(selectDocumentStatus);
  const feedback = useSelector(selectFeedback);
  const [isUploading, setIsUploading] = useState(false);
  const currentStepIndex = steps.indexOf(documentType);
  const [completed, setCompleted] = useState(new Set());

  // Handle updating completed steps when status changes
  useEffect(() => {
    if (status === "Approved") {
      setCompleted((prev) => {
        const newCompleted = new Set(prev);
        newCompleted.add(currentStepIndex);
        // Ensure all previous steps are marked completed
        for (let i = 0; i < currentStepIndex; i++) {
          newCompleted.add(i);
        }
        return newCompleted;
      });
    } else if (status === "Pending" || status === "Rejected") {
      // If Pending or Rejected, ensure previous steps are marked as completed
      setCompleted((prev) => {
        const newCompleted = new Set(prev);
        // Mark all previous steps as completed, but not the current one
        for (let i = 0; i < currentStepIndex; i++) {
          newCompleted.add(i);
        }
        return newCompleted;
      });
    }
  }, [status, currentStepIndex]);

  const handleFileUploadComplete = () => {
    setIsUploading(false); // Set uploading to false after the file is uploaded
    dispatch(VisaStatusThunk()); // Re-fetch
  };

  useEffect(() => {
    dispatch(VisaStatusThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!isUploading) {
      dispatch(VisaStatusThunk());
    }
  }, [isUploading, dispatch]);

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom mb={16}>
        Visa Status
      </Typography>

      {["OPT_receipt", "OPT_EAD", "I_983", "I_20"].includes(documentType) && (
        <Box
          display="flex"
          justifyContent="center"
          mb={6}
          sx={{ width: "100%" }}
        >
          <Stepper
            activeStep={currentStepIndex}
            alternativeLabel
            sx={{ width: "60%", justifyContent: "center" }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={completed.has(index)}>
                <StepLabel
                  error={status === "Rejected" && index === currentStepIndex}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "40%", padding: "40px", boxShadow: 3 }}>
          {documentType === "OPT_receipt" && (
            <OPTReceipt
              status={status}
              feedback={feedback}
              onFileUploadComplete={handleFileUploadComplete}
            />
          )}
          {documentType === "OPT_EAD" && (
            <OPTEAD
              status={status}
              feedback={feedback}
              onFileUploadComplete={handleFileUploadComplete}
            />
          )}
          {documentType === "I_983" && (
            <I983
              status={status}
              feedback={feedback}
              onFileUploadComplete={handleFileUploadComplete}
            />
          )}
          {documentType === "I_20" && (
            <I20
              status={status}
              feedback={feedback}
              onFileUploadComplete={handleFileUploadComplete}
            />
          )}
          {!["OPT_receipt", "OPT_EAD", "I_983", "I_20"].includes(
            documentType
          ) && (
            <Box display="flex" justifyContent="center">
              <Typography>You are all set.</Typography>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default UserVisaPage;
