import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid, Card, CardMedia, Typography } from "@mui/material";

const DocumentGallery = () => {
  const documents = useSelector((state) => state.document);
  const [preview, setPreview] = useState("");
  const filteredDocuments = Object.fromEntries(
    Object.entries(documents).filter(([key, value]) => value !== ""),
  );

  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    if (str == "OPT_receipt") {
      result = "OPT receipt";
    }
    if (str == "OPT_EAD") {
      result = "OPT EAD";
    }
    if (str == "I_983") {
      result = "I 983";
    }
    if (str == "I_20") {
      result = "I 20";
    }
    return result;
  }

  const handleClose = () => {
    window.scrollTo(0, document.body.scrollHeight);
    setPreview("");
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          mb: "2vh",
        }}
      >
        {Object.entries(filteredDocuments).map(([docType, url]) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            key={docType}
          >
            <Typography sx={{ ml: 1 }} variant="subtitle1">
              {transformString(docType)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
              }}
            >
              <Button
                variant="outlined"
                color="info"
                onClick={() => setPreview(url)}
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                color="info"
                onClick={() => handleDownload(url)}
              >
                Download
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {preview !== "" ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
              maxWidth: "50vw",
              ml: "25vw",
            }}
          >
            <CardMedia
              component="img"
              image={preview}
              alt="Preview Document"
              sx={{ objectFit: "cover" }}
            />
            <Button variant="outlined" color="info" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(DocumentGallery);
