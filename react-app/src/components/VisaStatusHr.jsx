import React, { useState } from "react";
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

const VisaStatusManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Dummy data for demonstration
  const inProgressEmployees = [
    {
      id: 1,
      name: "John Doe",
      workAuthorization: {
        title: "OPT",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        daysRemaining: 45,
      },
      nextStep: {
        description:
          "Submitted OPT receipt: next step is to wait for HR approval",
        document: "opt_receipt.pdf",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      workAuthorization: {
        title: "CPT",
        startDate: "2023-02-01",
        endDate: "2023-12-31",
        daysRemaining: 90,
      },
      nextStep: {
        description: "Waiting for document submission",
        document: "cpt_receipt.pdf",
      },
    },
  ];

  const allEmployees = [
    {
      id: 1,
      name: "John Doe",
      workAuthorization: {
        title: "OPT",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        daysRemaining: 45,
      },
      documents: [
        { name: "OPT Receipt", link: "opt_receipt.pdf", status: "Approved" },
        { name: "OPT Form", link: "opt_form.pdf", status: "Approved" },
      ],
      nextStep: "None",
    },
    {
      id: 2,
      name: "Jane Smith",
      workAuthorization: {
        title: "CPT",
        startDate: "2023-02-01",
        endDate: "2023-12-31",
        daysRemaining: 90,
      },
      documents: [
        { name: "CPT Receipt", link: "cpt_receipt.pdf", status: "Approved" },
      ],
      nextStep: "Submit final report",
    },
  ];

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

      {/* In Progress Section */}
      <Typography variant="h5" gutterBottom>
        In Progress
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Documents" />
          <Tab label="All" /> {/* Kept the All tab */}
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inProgressEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <div>
                      <strong>{employee.workAuthorization.title}</strong>
                      <div>
                        Start Date: {employee.workAuthorization.startDate}
                      </div>
                      <div>End Date: {employee.workAuthorization.endDate}</div>
                      <div>
                        Days Remaining:{" "}
                        {employee.workAuthorization.daysRemaining}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {employee.nextStep.document}
                      <Button
                        onClick={() => handleOpenModal(employee)}
                        variant="contained"
                        color="purple" // Change color to purple
                        style={{ marginLeft: "10px" }}
                      >
                        Preview
                      </Button>
                    </div>
                  </TableCell>
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
      {activeTab === 1 && ( // When "All" tab is clicked, display the following content
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
                  <TableCell>Uploaded Documents</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>
                      <div>
                        <strong>{employee.workAuthorization.title}</strong>
                        <div>
                          Start Date: {employee.workAuthorization.startDate}
                        </div>
                        <div>
                          End Date: {employee.workAuthorization.endDate}
                        </div>
                        <div>
                          Days Remaining:{" "}
                          {employee.workAuthorization.daysRemaining}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.nextStep}</TableCell>
                    <TableCell>
                      {employee.documents.map((doc) => (
                        <div key={doc.name}>
                          <span>{doc.name}</span>
                          <Button
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: "10px" }}
                          >
                            Download
                          </Button>
                          <Button
                            onClick={() => handleOpenModal(employee)}
                            variant="contained"
                            color="purple" // Change color to purple
                            style={{ marginLeft: "5px" }}
                          >
                            Preview
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

      {/* Modal for Document Preview */}
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
