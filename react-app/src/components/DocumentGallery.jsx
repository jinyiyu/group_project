import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DocumentGallery = () => {
  const documents = useSelector((state) => state.document);
  const [preview, setPreview] = useState("");
  const filteredDocuments = Object.fromEntries(
    Object.entries(documents).filter(([key, value]) => value !== ""),
  );

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      {Object.entries(filteredDocuments).map(([docType, url]) => (
        <div key={docType} style={{ marginBottom: "10px" }}>
          <strong>{docType}</strong>: {/* Display the document type */}
          <button onClick={() => setPreview(url)}>Preview</button>
          <button onClick={() => handleDownload(url)}>Download</button>
        </div>
      ))}

      {preview !== "" ? (
        <>
          <img
            src={preview}
            alt="preview Doc"
            style={{ width: "400px", height: "400px", objectFit: "cover" }}
          />
          <button onClick={() => setPreview("")}>Close</button>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(DocumentGallery);
