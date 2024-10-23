import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHouses,
  addHouse,
  deleteHouse,
  fetchHouseDetail,
} from "../store/hrHousingSlice/hrHousing.thunk";
import {
  selectHouses,
  selectHousingLoading,
  selectHousingError,
  selectHouseDetails,
} from "../store/hrHousingSlice/hrHousing.selectors";

const HrHousingManagement = () => {
  const dispatch = useDispatch();
  const houses = useSelector(selectHouses);
  const loading = useSelector(selectHousingLoading);
  const error = useSelector(selectHousingError);
  const houseDetails = useSelector(selectHouseDetails);

  const [inputError, setInputError] = useState("");
  const [selectedHouseId, setSelectedHouseId] = useState(null);

  const [newHouse, setNewHouse] = useState({
    address: "",
    landlord: { name: "", phone: "", email: "" },
    facilityInfo: { beds: "", mattresse: "", tables: "", chairs: "" },
    numOfResidents: 0,
  });

  useEffect(() => {
    dispatch(fetchAllHouses());
  }, [dispatch]);

  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => {
        setInputError("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [inputError]);

  const handleAddHouse = async () => {
    if (
      !newHouse.address ||
      !newHouse.landlord.name ||
      !newHouse.landlord.phone ||
      !newHouse.landlord.email ||
      !newHouse.facilityInfo.beds ||
      !newHouse.facilityInfo.mattresse ||
      !newHouse.facilityInfo.tables ||
      !newHouse.facilityInfo.chairs
    ) {
      setInputError("All fields must be filled out.");
      return;
    }

    try {
      setInputError("");
      await dispatch(addHouse(newHouse));
      setNewHouse({
        address: "",
        landlord: { name: "", phone: "", email: "" },
        facilityInfo: { beds: "", mattresse: "", tables: "", chairs: "" },
        numOfResidents: 0,
      });
      dispatch(fetchAllHouses());
    } catch (error) {
      console.error("Failed to add house:", error);
    }
  };

  const handleDeleteHouse = (houseId) => {
    dispatch(deleteHouse(houseId));
  };

  const handleNumberInput = (e, field) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setNewHouse({
        ...newHouse,
        facilityInfo: { ...newHouse.facilityInfo, [field]: value },
      });
    }
  };

  const handleSummaryView = (houseId) => {
    setSelectedHouseId(houseId);
    dispatch(fetchHouseDetail(houseId));
  };

  return (
    <div>
      <h1>Housing Management</h1>
      {loading && <p>Loading houses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {inputError && <p style={{ color: "red" }}>{inputError}</p>}

      <div>
        <h2>Add New House</h2>
        <div className="add-housing-input">
          <input
            type="text"
            placeholder="Address"
            value={newHouse.address}
            onChange={(e) =>
              setNewHouse({ ...newHouse, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Landlord Name"
            value={newHouse.landlord.name}
            onChange={(e) =>
              setNewHouse({
                ...newHouse,
                landlord: { ...newHouse.landlord, name: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Landlord Phone"
            value={newHouse.landlord.phone}
            onChange={(e) =>
              setNewHouse({
                ...newHouse,
                landlord: { ...newHouse.landlord, phone: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Landlord Email"
            value={newHouse.landlord.email}
            onChange={(e) =>
              setNewHouse({
                ...newHouse,
                landlord: { ...newHouse.landlord, email: e.target.value },
              })
            }
          />
        </div>
        <div className="add-housing-input">
          <input
            type="text"
            placeholder="Number of Beds"
            value={newHouse.facilityInfo.beds}
            onChange={(e) => handleNumberInput(e, "beds")}
          />
          <input
            type="text"
            placeholder="Number of Mattresses"
            value={newHouse.facilityInfo.mattresse}
            onChange={(e) => handleNumberInput(e, "mattresse")}
          />
          <input
            type="text"
            placeholder="Number of Tables"
            value={newHouse.facilityInfo.tables}
            onChange={(e) => handleNumberInput(e, "tables")}
          />
          <input
            type="text"
            placeholder="Number of Chairs"
            value={newHouse.facilityInfo.chairs}
            onChange={(e) => handleNumberInput(e, "chairs")}
          />
        </div>
        <button onClick={handleAddHouse}>Add House</button>
      </div>

      <h2>Existing Houses</h2>
      {houses.map((house, index) => (
        <div key={house.id || index}>
          <h3>{house.address}</h3>
          <p>Landlord: {house.landlord?.name ? house.landlord.name : "N/A"}</p>
          <p>Phone: {house.landlord?.phone || "N/A"}</p>
          <p>Email: {house.landlord?.email || "N/A"}</p>
          <p>Number of Residents: {house.numOfResidents}</p>
          <button onClick={() => handleSummaryView(house.id)}>Summary</button>
          <button onClick={() => handleDeleteHouse(house.id)}>Delete</button>

          {selectedHouseId === house.id && houseDetails && (
            <div>
              <h4>Facility Information:</h4>
              <p>Beds: {houseDetails.facilityInfo.beds}</p>
              <p>Mattresses: {houseDetails.facilityInfo.mattresses}</p>
              <p>Tables: {houseDetails.facilityInfo.tables}</p>
              <p>Chairs: {houseDetails.facilityInfo.chairs}</p>

              <h4>Facility Reports:</h4>
              {houseDetails.facilityReports.slice(0, 5).map((report) => (
                <div key={report.id}>
                  <h4>{report.title}</h4>
                  <p>Description: {report.description}</p>
                  <p>Status: {report.status}</p>
                  <p>Created by: {report.createdBy}</p>
                  <p>Date: {new Date(report.timestamp).toLocaleString()}</p>

                  <h4>Comments:</h4>
                  {report.comments.map((comment) => (
                    <div key={comment.id}>
                      <p>{comment.description}</p>
                      <p>By: {comment.createdBy}</p>
                      <p>At: {new Date(comment.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ))}

              <h4>Employee Information:</h4>
              {houseDetails.employees.map((employee) => (
                <div key={employee.email}>
                  <p>Name: {employee.fullName}</p>
                  <p>Phone: {employee.phone}</p>
                  <p>Email: {employee.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HrHousingManagement;
