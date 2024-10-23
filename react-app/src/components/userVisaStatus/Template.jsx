// import { useDispatch, useSelector } from "react-redux";
// import { fetchI983TemplateThunk } from "../../store/statusSlice/status.thunk";

// const Template = () => {
//   const dispatch = useDispatch();
//   const handleDownload = (templateType) => {
//     dispatch(fetchI983TemplateThunk(templateType));
//   };
//   return (
//     <div>
//       <ul>
//         <li>
//           <button onClick={() => handleDownload("empty")}>
//             Download Empty Template
//           </button>
//         </li>
//         <li>
//           <button onClick={() => handleDownload("sample")}>
//             Download Sample Template
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };
// export default Template;

import { useDispatch } from "react-redux";
import { fetchI983TemplateThunk } from "../../store/statusSlice/status.thunk";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const Template = () => {
  const dispatch = useDispatch();

  const handleDownload = (templateType) => {
    dispatch(fetchI983TemplateThunk(templateType));
  };

  return (
    <Box mt={4} display="flex" justifyContent="center" gap={4}>
      <Card sx={{ maxWidth: 300 }}>
        <CardContent>
          <Typography variant="h6">Empty Template</Typography>
          <Typography color="textSecondary">
            Download an empty I-983 template for filling out.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={() => handleDownload("empty")}
          >
            Download
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ maxWidth: 300 }}>
        <CardContent>
          <Typography variant="h6">Sample Template</Typography>
          <Typography color="textSecondary">
            Download a filled-out I-983 sample template.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudDownloadIcon />}
            onClick={() => handleDownload("sample")}
          >
            Download
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Template;
