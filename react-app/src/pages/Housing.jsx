import HousingDetails from "./HousingDetails";

import { Paper, Box, Typography, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CreateReport from "../components/CreateRport";
import ReportHistory from "../components/ReportHistory";

const Housing = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",

        flexDirection: "column",
      }}
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid>
              <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
                <CreateReport />
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
                <Typography variant="h5" gutterBottom>
                  Housing Details
                </Typography>
                <HousingDetails />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} md={8}>
          <Paper elevation={10} sx={{ p: 4, height: "100%", minWidth: "105%" }}>
            <ReportHistory />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Housing;
