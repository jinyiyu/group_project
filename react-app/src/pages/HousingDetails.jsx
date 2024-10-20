import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initHousingThunk } from "../store/housingSlice/housing.thunk";
import {
  selectHouseAddress,
  selectRoommates,
} from "../store/housingSlice/housing.selectors";

const HousingDetails = () => {
  const dispatch = useDispatch();
  const houseAddress = useSelector(selectHouseAddress);
  const roommates = useSelector(selectRoommates);

  useEffect(() => {
    dispatch(initHousingThunk());
  }, [dispatch]);

  return (
    <div>
      <h2>Housing Details</h2>
      <p>
        <strong>Address:</strong>
        {houseAddress}
      </p>
      <h3>Roommates</h3>
      <ul>
        {roommates.map((roommate, index) => {
          <li key={index}>
            {roommate.firstName} {roommate.lastName}
          </li>;
        })}
      </ul>
    </div>
  );
};

export default HousingDetails;
