import UploadForm from "./UploadForm";
import { useState } from "react";

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
    <div>
      <h2>VisaStatus</h2>
      {status === "Pending" && (
        <p>Waiting for HR to approve your OPT Receipt.</p>
      )}
      {status === "Approved" && (
        <>
          <p>Please upload a copy of your OPT EAD.</p>
          <UploadForm
            documentType="OPT_EAD"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </>
      )}
      {status === "Rejected" && (
        <>
          <p>HR Feedback: {feedback}</p>
          <UploadForm
            documentType="OPT_receipt"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </>
      )}
    </div>
  );
};

export default OPTReceipt;
