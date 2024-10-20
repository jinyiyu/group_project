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

const VisaStatusManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [employeesWithPendingDocs, setEmployeesWithPendingDocs] = useState([]);
  const [visaEmployees, setVisaEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the pending-docs API
  useEffect(() => {
    const fetchPendingDocsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/employee/pending-docs"
        );
        if (response.data.success) {
          setEmployeesWithPendingDocs(response.data.data);
          console.log(response.data.data);
        } else {
          setError("Failed to fetch pending documents.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDocsData();
  }, []);

  // Fetch data from the visa-employees API
  useEffect(() => {
    setLoading(true);
    const fetchVisaEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/employee/visa-employees"
        );
        if (response.data.success) {
          setVisaEmployees(response.data.data);
          //   console.log(response.data.data);
        } else {
          setError("Failed to fetch visa employees.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisaEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (visaEmployees) => {
    // setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
                          <a
                            href={employee.latestDocument.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="preview-button">
                              Preview Document
                            </button>
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>next step: random text</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      style={{ marginRight: "5px" }}
                    >
                      Approve
                    </Button>
                    <Button variant="contained" color="error">
                      Reject
                    </Button>
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
          <Typography variant="h5" gutterBottom style={{ marginTop: "40px" }}>
            All
          </Typography>
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
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            color="primary"
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
          <iframe
            src={selectedEmployee?.nextStep.document}
            style={{ width: "100%", height: "400px" }}
            title="Document Preview"
          ></iframe>
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
