import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const UserVisaPage = () => {
  const dispatch = useDispatch();
  const documentType = useSelector(selectDocumentType);
  const status = useSelector(selectDocumentStatus);
  const feedback = useSelector(selectFeedback);
  const [isUploading, setIsUploading] = useState(false);

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
    <div>
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
      {!["OPT_receipt", "OPT_EAD", "I_983", "I_20"].includes(documentType) && (
        <p>You are all set.</p>
      )}
    </div>
  );
};

export default UserVisaPage;
