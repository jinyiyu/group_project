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
  previewDocumentThunk,
} from "../store/employeeSlice/employee.thunk";
import {
  selectEmployeesWithPendingDocs,
  selectVisaEmployees,
  selectEmployeeLoading,
  selectEmployeeError,
} from "../store/employeeSlice/employee.selectors";
import { useDispatch, useSelector } from "react-redux";

const VisaStatusManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [documentUrl, setDocumentUrl] = useState("");
  // const [preview, setPreview] = useState("");
  const url =
    "https://bfgp.s3.amazonaws.com/67147b5445846b9bac51d17f/profilePicture";

  const dispatch = useDispatch();

  const employeesWithPendingDocs = useSelector(selectEmployeesWithPendingDocs);
  const visaEmployees = useSelector(selectVisaEmployees);
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);

  useEffect(() => {
    dispatch(fetchPendingDocsThunk());
    dispatch(fetchVisaEmployeesThunk());
  }, [dispatch]);

  const handleDocumentDownload = (documentS3Path) => {
    dispatch(previewDocumentThunk(documentS3Path));
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (visaEmployees, fileurl) => {
    // setSelectedEmployee(employee);
    setDocumentUrl(fileurl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalOpen(false);
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Visa Status Management
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Employee"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />

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
                            handleOpenModal(
                              employee,
                              employee.latestDocument.fileUrl
                            )
                          }
                        >
                          Preview Document
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          style={{ marginRight: "3px" }}
                        >
                          Approve
                        </Button>
                        <Button variant="contained" color="error">
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
                {visaEmployees.map((visaEmployee, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {visaEmployee.name.firstName} {visaEmployee.name.lastName}
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
                        <div>Days Remaining:{visaEmployee.daysRemaining} </div>
                      </div>
                    </TableCell>
                    <TableCell>Next steps: random text</TableCell>
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
                            onClick={() =>
                              handleOpenModal(visaEmployee, doc.fileUrl)
                            }
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
                            // onClick={() => handleDocumentDownload(doc.fileUrl)}
                            onClick={() => handleDownload(url)}
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
            Document Preview for {selectedEmployee?.name}
          </Typography>
          {url.endsWith(".pdf") ? (
            <iframe
              src={url}
              title="File Preview"
              style={{ width: "100%", height: "500px" }}
            />
          ) : (
            <img src={url} alt="File Preview" style={{ maxWidth: "100%" }} />
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
