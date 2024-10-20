import UploadForm from "./UploadForm";
import { useState } from "react";
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
    <div>
      <h2>Visa Status</h2>
      {status === "Pending" && (
        <p>Waiting for HR to approve and sign your I-983.</p>
      )}
      {status === "Approved" && (
        <div>
          <p>Please send the I-983 to your school and upload the new I-20.</p>
          <UploadForm
            documentType="I-20"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}
      {status === "Rejected" && (
        <>
          <p>HR Feedback: {feedback}</p>
          <UploadForm
            documentType="I-983"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </>
      )}
    </div>
  );
};
export default I983;
