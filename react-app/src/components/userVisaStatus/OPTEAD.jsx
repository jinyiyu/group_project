import UploadForm from "./UploadForm";
import Template from "./Template";
import { useState } from "react";
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
    <div>
      <h2>Visa Status</h2>
      {status === "Pending" && <p>Waiting for HR to approve your OPT EAD.</p>}
      {status === "Approved" && (
        <div>
          <p>Please download and fill out the I-983 form.</p>
          <Template />
          <UploadForm
            documentType="I_983"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}
      {status === "Rejected" && (
        <>
          <p>HR Feedback: {feedback}</p>

          <UploadForm
            documentType="OPT_EAD"
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
          />
        </>
      )}
    </div>
  );
};

export default OPTEAD;
