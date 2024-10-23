import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid, Card, CardMedia, Typography } from "@mui/material";

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
    <Box sx={{ mx: "auto", my: 2, p: 2 }}>
      {/* Grid for document buttons */}
      <Grid container spacing={2} justifyContent="center">
        {Object.entries(filteredDocuments).map(([docType, url]) => (
          <Grid item key={docType}>
            <Card sx={{ p: 1, minWidth: 150, textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{docType}</strong>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setPreview(url)}
                sx={{ mb: 1 }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDownload(url)}
              >
                Download
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Display the selected document preview */}
      {preview !== "" && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Card sx={{ display: "inline-block" }}>
            <CardMedia
              component="img"
              image={preview}
              alt="Preview Document"
              sx={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
          </Card>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setPreview("")}>
              Close Preview
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default memo(DocumentGallery);
