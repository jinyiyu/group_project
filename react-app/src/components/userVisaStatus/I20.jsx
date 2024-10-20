import UploadForm from "./UploadForm";
import { useState } from "react";
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
    <div>
      <h2>Visa Status</h2>
      {status === "Pending" && <p>Waiting for HR to approve your I-20.</p>}
      {status === "Approved" && <p>All documents have been approved.</p>}
      {status === "Rejected" && (
        <>
          <p>HR Feedback: {feedback}</p>
          <UploadForm
            documentType="I-20"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </>
      )}
    </div>
  );
};
export default I20;
