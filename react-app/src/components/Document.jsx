import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserThunk } from '../store/userSlice/userThunks';
import { fetchDocumentThunk } from '../store/documentSlice/documentThunk';
import { updateDocument } from '../store/documentSlice/documentSlice';
import { addEmergencyContact, updateField, deleteEmergencyContact} from '../store/userSlice/userSlice';

const DocumentGallery = () => {
  const documents = useSelector((state) => state.document);
  const filteredDocuments = Object.fromEntries(
    Object.entries(documents).filter(([key, value]) => value !== "")
  );
  


  const handleDownload = (url) => {
    window.open(url, '_blank');
  };


  return (
    <>
    {Object.entries(filteredDocuments).map(([docType, url]) => (
        <div key={docType} style={{ marginBottom: '10px' }}>
            <strong>{docType}</strong>: {/* Display the document type */}
            <button onClick={() => handleDownload(url)}>Preview</button>
            <button onClick={() => handleDownload(url)}>Download</button>
        </div>
    ))}
    </>
  )
}

export default DocumentGallery;
