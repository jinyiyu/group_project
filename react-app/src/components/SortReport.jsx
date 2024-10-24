import { Switch, Box, FormControlLabel } from "@mui/material";

const SortReport = ({ sortOption, setSortOption }) => {
  const handleSortChange = (e) => {
    setSortOption(sortOption === "latest" ? "oldest" : "latest");
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={sortOption === "latest"}
            onChange={handleSortChange}
            inputProps={{ "aria-label": "Sort by latest or oldest" }}
          />
        }
        label="Latest"
      />
    </Box>
  );
};

export default SortReport;
