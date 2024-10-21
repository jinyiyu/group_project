import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileThunk } from "../../store/statusSlice/status.thunk";
import { selectUploadedDocument } from "../../store/statusSlice/file.selectors";

const UploadForm = ({ documentType, onUploadStart, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const uploadedDocument = useSelector(selectUploadedDocument);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUploadStart(); // Notify the parent component that the upload started
      dispatch(uploadFileThunk({ file: selectedFile, documentType }))
        .unwrap()
        .then(() => {
          onUploadSuccess(); // Notify the parent component that the upload is successful
        })
        .catch((error) => {
          console.error("File upload failed:", error);
        });
    }
  };

  return (
    <div>
      <h3>Upload {documentType}</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Submit</button>
      {uploadedDocument && <p>File uploaded successfully!</p>}
    </div>
  );
};

export default UploadForm;
