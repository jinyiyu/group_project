import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHouses,
  addHouse,
  deleteHouse,
  fetchHouseDetail,
  addCommentToFacilityReport,
  updateCommentToFacilityReport,
} from "../store/hrHousingSlice/hrHousing.thunk";
import {
  selectHouses,
  selectHousingLoading,
  selectHousingError,
  selectHouseDetails,
} from "../store/hrHousingSlice/hrHousing.selectors";

import EmployeeProfileModel from "../components/EmployeeProfileModel.jsx"; // Import the modal for employee details
import { fetchUserByIdThunk } from "../store/userSlice/userThunks.js"; // Import to fetch user details by ID
import PersonalInfoView from "./personalInfoView.jsx"; // Import to display user details

const HrHousingManagement = () => {
  const dispatch = useDispatch();
  const houses = useSelector(selectHouses);
  const loading = useSelector(selectHousingLoading);
  const error = useSelector(selectHousingError);
  const houseDetails = useSelector(selectHouseDetails);

  const [inputError, setInputError] = useState("");
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [activeTab, setActiveTab] = useState("facility");

  const [commentInput, setCommentInput] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const [user, setUser] = useState(null); // State for selected employee's details
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // State for selected employee ID

  const { user: currentUser } = useSelector((state) => state.userAuth);

  // const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.userAuth);
  // let currentUserId = "";

  const currentUserId = currentUser ? currentUser.id : "";

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
    setActiveTab("facility");
    dispatch(fetchHouseDetail(houseId));
  };

  const handleAddComment = async (reportId, houseId) => {
    if (!commentInput) {
      setInputError("Comment cannot be empty.");
      return;
    }

    await dispatch(
      addCommentToFacilityReport({
        reportId,
        description: commentInput,
        userId: currentUserId,
      })
    );
    dispatch(fetchHouseDetail(houseId));
    setCommentInput("");
  };

  const handleEditComment = async (reportId, commentId, houseId) => {
    if (!commentInput) {
      setInputError("Comment cannot be empty.");
      return;
    }
    await dispatch(
      updateCommentToFacilityReport({
        reportId,
        commentId,
        description: commentInput,
        currentUserId,
      })
    );
    dispatch(fetchHouseDetail(houseId));
    setCommentInput("");
    setEditingComment(null);
  };

  const handleOpenModal = (id) => {
    console.log(id);
    dispatch(fetchUserByIdThunk(id))
      .unwrap()
      .then((result) => {
        setUser(result);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Fetch user by ID failed:", error);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Housing Management (HR)</h2>
      {loading && <p>Loading houses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {inputError && <p style={{ color: "red" }}>{inputError}</p>}

      {/* Add New House Feature */}
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

      {/* List of existing houses */}
      <h2>Existing Houses</h2>
      {houses.map((house, index) => (
        <div className="existing-house" key={house.id || index}>
          <h3>{house.address}</h3>
          <p>Landlord: {house.landlord?.name ? house.landlord.name : "N/A"}</p>
          <p>Phone: {house.landlord?.phone || "N/A"}</p>
          <p>Email: {house.landlord?.email || "N/A"}</p>
          <p>Number of Residents: {house.numOfResidents}</p>
          <button onClick={() => handleSummaryView(house.id)}>Summary</button>
          <button onClick={() => handleDeleteHouse(house.id)}>Delete</button>
          <br />
          {/* House Summary */}
          {selectedHouseId === house.id && houseDetails && (
            <div className="house-summary">
              <button
                className="close-summary-button"
                onClick={() => setSelectedHouseId(null)}
              >
                Close Summary
              </button>
              {/* Tab navigation */}
              <div className="house-summary-tabs">
                <button
                  className={`house-tab ${
                    activeTab === "facility" ? "active-tab" : ""
                  }`}
                  onClick={() => setActiveTab("facility")}
                >
                  Facility Information
                </button>
                <button
                  className={`house-tab ${
                    activeTab === "employee" ? "active-tab" : ""
                  }`}
                  onClick={() => setActiveTab("employee")}
                >
                  Employee Information
                </button>
              </div>

              {/* Tab content */}
              <div className="house-summary-tab-content">
                {activeTab === "facility" && (
                  <div className="house-facility-info">
                    <h4>Facility Information:</h4>
                    <p>Beds: {houseDetails.facilityInfo.beds}</p>
                    <p>Mattresses: {houseDetails.facilityInfo.mattresses}</p>
                    <p>Tables: {houseDetails.facilityInfo.tables}</p>
                    <p>Chairs: {houseDetails.facilityInfo.chairs}</p>

                    <h4>Facility Reports:</h4>
                    {houseDetails.facilityReports
                      .slice(0, 5)
                      .map((report, index) => (
                        <div
                          className="facility-report"
                          key={report.id || index}
                        >
                          <h4>{report.title}</h4>
                          <p>Description: {report.description}</p>
                          <p>Status: {report.status}</p>
                          <p>Created by: {report.createdBy}</p>
                          <p>
                            Date: {new Date(report.timestamp).toLocaleString()}
                          </p>

                          <h4>Comments:</h4>
                          {report.comments.map((comment) => (
                            <div className="facility-comment" key={comment.id}>
                              <p>{comment.description}</p>
                              {/* <p>By: {comment.createdBy}</p> */}
                              <p>
                                At:{" "}
                                {new Date(comment.timestamp).toLocaleString()}
                              </p>
                              {/* If the comment is by the current user, allow editing */}
                              {comment.commentUserId === currentUserId && (
                                <button
                                  onClick={() => setEditingComment(comment.id)}
                                >
                                  Edit Comment
                                </button>
                              )}
                            </div>
                          ))}
                          <div>
                            <textarea
                              placeholder="Enter your comment"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                            ></textarea>{" "}
                            <br />
                            {editingComment ? (
                              <div>
                                <button
                                  onClick={() =>
                                    handleEditComment(
                                      report.id,
                                      editingComment,
                                      house.id
                                    )
                                  }
                                >
                                  Update Comment
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingComment(null);
                                    setCommentInput("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAddComment(report.id, house.id)
                                }
                              >
                                Add Comment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {activeTab === "employee" && (
                  <div className="house-employee-info">
                    <h4>Employee Information:</h4>
                    {houseDetails.employees.map((employee) => (
                      <div className="employee-info" key={employee.email}>
                        <p>
                          Name:{" "}
                          <span
                            className="employee-link"
                            onClick={() => handleOpenModal(employee.id)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {employee.fullName}
                          </span>
                        </p>
                        <p>Phone: {employee.phone}</p>
                        <p>Email: {employee.email}</p>
                        <p>
                          Car:{" "}
                          {employee.car ? (
                            <span>
                              {employee.car.model} - {employee.car.color}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Employee Modal */}
      <EmployeeProfileModel isOpen={isModalOpen} onClose={handleCloseModal}>
        {user && (
          <PersonalInfoView
            user={user}
            className="modal-overlay modal-content"
          />
        )}
      </EmployeeProfileModel>
    </div>
  );
};

export default HrHousingManagement;
