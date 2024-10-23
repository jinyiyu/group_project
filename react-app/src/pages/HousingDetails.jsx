import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initHousingThunk } from "../store/housingSlice/housing.thunk";
import {
  selectHouseAddress,
  selectRoommates,
} from "../store/housingSlice/housing.selectors";
import { Box, Typography, List, ListItem, Chip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

const HousingDetails = () => {
  const dispatch = useDispatch();
  const houseAddress = useSelector(selectHouseAddress);
  const roommates = useSelector(selectRoommates);

  useEffect(() => {
    dispatch(initHousingThunk());
  }, [dispatch]);

  return (
    // <div>
    //   <p>
    //     <strong>Address:</strong>
    //     {houseAddress}
    //   </p>
    //   <h3>Roommates</h3>
    //   {roommates && roommates.length > 0 ? (
    //     <ul>
    //       {roommates.map((roommate, index) => (
    //         <li key={index}>
    //           {roommate.firstName} {roommate.lastName}
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p>None</p>
    //   )}
    // </div>

    <Box>
      <Typography variant="body1" mb={2} mt={2}>
        <strong>Address:</strong> {houseAddress}
      </Typography>

      <Typography variant="h5" component="h3">
        Roommates
      </Typography>

      {roommates && roommates.length > 0 ? (
        <List>
          {roommates.map((roommate, index) => (
            <ListItem key={index}>
              {/* <Typography variant="body1">
                {roommate.firstName} {roommate.lastName}
              </Typography> */}
              <Chip
                icon={<FaceIcon />}
                label={`${roommate.firstName} ${roommate.lastName}`}
                sx={{ mr: 2 }}
                variant="outlined"
                color="primary"
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          None
        </Typography>
      )}
    </Box>
  );
};

export default HousingDetails;
