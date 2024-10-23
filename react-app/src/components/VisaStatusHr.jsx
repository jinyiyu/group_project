import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Modal,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import emailjs from "@emailjs/browser";
import {
  fetchPendingDocsThunk,
  fetchVisaEmployeesThunk,
  updateWithFeedbackThunk,
} from "../store/employeeSlice/employee.thunk";
import {
  setSearchQuery,
  setDropdownVisible,
  setDisplayedEmployees,
} from "../store/employeeSlice/employeeSlice";
import {
  selectEmployeesWithPendingDocs,
  selectVisaEmployees,
  selectEmployeeLoading,
  selectEmployeeError,
  selectSearchQuery,
  selectDisplayedEmployees,
  selectDropdownVisible,
} from "../store/employeeSlice/employee.selectors";
import { useDispatch, useSelector } from "react-redux";

const VisaStatusManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [documentUrl, setDocumentUrl] = useState("");

  const dispatch = useDispatch();
  const employeesWithPendingDocs = useSelector(selectEmployeesWithPendingDocs);
  const visaEmployees = useSelector(selectVisaEmployees);
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);

  const searchQuery = useSelector(selectSearchQuery);
  const displayedEmployees = useSelector(selectDisplayedEmployees);
  const dropdownVisible = useSelector(selectDropdownVisible);

  // console.log("employeesWithPendingDocs:", employeesWithPendingDocs);
  // console.log("visaEmployees: ", visaEmployees);

  useEffect(() => {
    dispatch(fetchPendingDocsThunk());
    dispatch(fetchVisaEmployeesThunk());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  //handle tab change for In Progress and All
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  //modal open and close handlers for document preview
  const handleOpenModal = (fileurl) => {
    setDocumentUrl(fileurl);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setDocumentUrl("");
  };

  const handleDownload = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const determineNextStep = (employee) => {
    const { documentType, status } = employee.latestDocument;

    if (documentType === "OPT_receipt") {
      if (status === "Pending") {
        return "OPT receipt submitted, next step is to wait for HR approval.";
      } else if (status === "Approved") {
        return "OPT receipt approved, next step is to submit OPT-EAD.";
      } else if (status === "Rejected") {
        return "OPT receipt rejected, next step is to resubmit OPT receipt.";
      }
    }

    if (documentType === "OPT_EAD") {
      if (status === "Pending") {
        return "OPT EAD submitted, next step is to wait for HR approval.";
      } else if (status === "Approved") {
        return "OPT EAD approved, next step is to submit I-983.";
      } else if (status === "Rejected") {
        return "OPT EAD rejected, next step is to resubmit OPT EAD.";
      }
    }

    if (documentType === "I_983") {
      if (status === "Pending") {
        return "I-983 submitted, next step is to wait for HR approval.";
      } else if (status === "Approved") {
        return "I-983 approved, next step is to submit I-20.";
      } else if (status === "Rejected") {
        return "I-983 rejected, next step is to resubmit I-983.";
      }
    }

    if (documentType === "I_20") {
      if (status === "Pending") {
        return "I-20 submitted, next step is to wait for HR approval.";
      } else if (status === "Approved") {
        return "I-20 approved, all steps completed!";
      } else if (status === "Rejected") {
        return "I-20 rejected, next step is to resubmit I-20.";
      }
    }

    return "No document submitted, next step is to submit OPT receipt.";
  };

  //send Email button click handler
  const sendEmail = (employee) => {
    const templateParams = {
      to_email: employee.name.email,
      message: `Dear ${employee.name.firstName} ${
        employee.name.lastName
      }, \n\nPlease be informed of your next step regarding your visa document: ${determineNextStep(
        employee
      )}\n\nBest regards,\nVisa Management Team`,
    };

    emailjs
      .send(
        "service_qajtlhi",
        "template_dfpkctt",
        templateParams,
        "SlwYI4G9g1yD3FUSt"
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          alert("Notification sent successfully!");
        },
        (error) => {
          console.log("Failed to send email:", error.text);
          alert("Failed to send notification.");
        }
      );
  };

  // Approve button click handler
  const handleApprove = async (_id) => {
    console.log(_id);
    try {
      dispatch(updateWithFeedbackThunk({ _id, status: "Approved" })).unwrap();
      alert("Document is approved");
      window.location.reload();
      useEffect(() => {}, [dispatch]);
    } catch (error) {
      console.error("Failed to approve document:", error);
    }
  };
  // Reject button click handler
  const handleReject = (_id) => {
    const userFeedback = prompt("Please provide feedback for rejection:");
    if (userFeedback) {
      try {
        dispatch(
          updateWithFeedbackThunk({
            _id,
            status: "Rejected",
            feedback: userFeedback,
          })
        ).unwrap();
        alert("Document is rejected");
        window.location.reload();
      } catch (error) {
        console.error("Failed to reject document:", error);
      }
    }
  };

  const handleSearch = () => {
    const filteredEmployees = visaEmployees.filter((employee) =>
      `${employee.name.firstName} ${employee.name.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    dispatch(setDisplayedEmployees(filteredEmployees));
    dispatch(setDropdownVisible(false));
  };

  const handleDropdownClick = (name) => {
    dispatch(setSearchQuery(name));
    dispatch(setDropdownVisible(false));
  };

  const highlightSearchTerm = (fullName, searchTerm) => {
    const index = fullName.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return fullName;
    const beforeMatch = fullName.slice(0, index);
    const match = fullName.slice(index, index + searchTerm.length);
    const afterMatch = fullName.slice(index + searchTerm.length);
    return (
      <>
        {beforeMatch}
        <strong style={{ backgroundColor: "yellow" }}>{match}</strong>
        {afterMatch}
      </>
    );
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Visa Status Management
      </Typography>

      {/* tabs to switch In Progress and All */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="In Progress" />
          <Tab label="All" />
        </Tabs>
      </Box>

      {/* In Progress Tab Content */}
      {activeTab === 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Work Authorization</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Next Steps</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeesWithPendingDocs.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {employee.name.firstName} {employee.name.lastName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <strong>{employee.workAuthorizationTitle.title};</strong>
                      <div>
                        Start Date:{" "}
                        {moment(employee.workAuthorizationTitle.start).format(
                          "MMMM Do YYYY"
                        )}
                      </div>
                      <div>
                        End Date:{" "}
                        {moment(employee.workAuthorizationTitle.end).format(
                          "MMMM Do YYYY"
                        )}
                      </div>
                      <div>Days Remaining:{employee.daysRemaining} </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {employee.latestDocument.length === 0 ? (
                        <p>No documents pending or rejected.</p>
                      ) : (
                        <div className="document-card">
                          <p>
                            <strong>Document Type:</strong>{" "}
                            {employee.latestDocument.documentType}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {employee.latestDocument.status}
                          </p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <strong>Next Step: </strong>
                    {determineNextStep(employee)}
                  </TableCell>
                  <TableCell>
                    {employee.latestDocument.status === "Pending" ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginRight: "3px" }}
                          onClick={() =>
                            handleOpenModal(employee.latestDocument.fileUrl)
                          }
                        >
                          Preview Document
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          style={{ marginRight: "3px" }}
                          onClick={() =>
                            handleApprove(employee.latestDocument._id)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleReject(employee.latestDocument._id)
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="warning"
                        style={{ marginRight: "3px" }}
                        onClick={() => sendEmail(employee)}
                      >
                        Send Notification
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* All Tab Content */}
      {activeTab === 1 && (
        <>
          <div>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => {
                dispatch(setSearchQuery(e.target.value));
                dispatch(setDropdownVisible(true));
              }}
              style={{ position: "relative", zIndex: 1 }}
            />
            <button onClick={handleSearch}>Search</button>

            {dropdownVisible && searchQuery && (
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  border: "1px solid #000",
                  maxHeight: "150px",
                  overflowY: "auto",
                  position: "absolute",
                  backgroundColor: "#fff",
                  zIndex: 2,
                }}
              >
                {visaEmployees
                  .filter((employee) =>
                    `${employee.name.firstName} ${employee.name.lastName}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((employee, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "5px",
                        cursor: "pointer",
                        borderBottom: "1px solid #ccc",
                      }}
                      onClick={() =>
                        handleDropdownClick(
                          `${employee.name.firstName} ${employee.name.lastName}`
                        )
                      }
                    >
                      {highlightSearchTerm(
                        `${employee.name.firstName} ${employee.name.lastName}`,
                        searchQuery
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {displayedEmployees.length === 0 && searchQuery ? (
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              No records found.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Work Authorization</TableCell>
                    <TableCell>Next Steps</TableCell>
                    <TableCell>All Uploaded Documents</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(displayedEmployees.length === 0 && !searchQuery
                    ? visaEmployees
                    : displayedEmployees
                  ).map((visaEmployee, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {visaEmployee.name.firstName}{" "}
                        {visaEmployee.name.lastName}
                      </TableCell>
                      <TableCell>
                        <div>
                          <strong>
                            {visaEmployee["Work Authorization Title"].title}
                          </strong>
                          <div>
                            Start Date:{" "}
                            {moment(
                              visaEmployee["Work Authorization Title"].start
                            ).format("MMMM Do YYYY")}
                          </div>
                          <div>
                            End Date:{" "}
                            {moment(
                              visaEmployee["Work Authorization Title"].end
                            ).format("MMMM Do YYYY")}
                          </div>
                          <div>
                            Days Remaining:{visaEmployee.daysRemaining}{" "}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        Next steps: {determineNextStep(visaEmployee)}
                      </TableCell>
                      <TableCell>
                        {visaEmployee.documents.map((doc, index) => (
                          <div key={index}>
                            <span>
                              document{doc.index}: {doc.documentType}
                            </span>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {visaEmployee.documents.map((doc, index) => (
                          <div key={index} style={{ marginBottom: "10px" }}>
                            <Button
                              onClick={() => handleOpenModal(doc.fileUrl)}
                              variant="contained"
                              color="blue"
                              style={{ marginRight: "5px" }}
                            >
                              Preview
                            </Button>
                            <Button
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              color="primary"
                              onClick={() => handleDownload(doc.fileUrl)}
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="document-preview"
        aria-describedby="modal-for-previewing-documents"
      >
        <div
          style={{
            width: "70%",
            margin: "auto",
            marginTop: "100px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Typography variant="h6" id="document-preview">
            Document Preview
          </Typography>
          {documentUrl.endsWith(".pdf") ? (
            <iframe
              src={documentUrl}
              title="File Preview"
              style={{ width: "100%", height: "500px" }}
            />
          ) : (
            <img
              src={documentUrl}
              alt="File Preview"
              style={{ maxWidth: "100%" }}
            />
          )}
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default VisaStatusManagementPage;
