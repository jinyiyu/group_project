import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/employeeSummaryView.css";
import EmployeeProfileModel from "./employeeProfileModel.jsx";
import Pagination from "@mui/material/Pagination";

import {
  setEmployees,
  setSearchQuery,
  setDropdownVisible,
  setDisplayedEmployees,
} from "../store/employeeSlice";

const EmployeeSummaryView = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.allEmployees);
  const searchQuery = useSelector((state) => state.employees.searchQuery);
  const dropdownVisible = useSelector(
    (state) => state.employees.dropdownVisible,
  );
  const displayedEmployees = useSelector(
    (state) => state.employees.displayedEmployees,
  );

  useEffect(() => {
    const fetchAndSetEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/employee/profile");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const employees = await response.json();
        dispatch(setEmployees(employees));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchAndSetEmployees();
  }, [dispatch]);

  // Sort employees alphabetically by last name
  const sortedEmployees = [...displayedEmployees].sort((a, b) =>
    a.name.lastName.localeCompare(b.name.lastName),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 20;

  // Calculate the total number of pages
  const totalPages = Math.ceil(displayedEmployees.length / employeesPerPage);

  // Calculate the employees to display for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = () => {
    const filteredEmployees = employees.filter((employee) =>
      `${employee.name.firstName} ${employee.name.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
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

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="employee-container">
      <h1>Summary View</h1>
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
          {employees
            .filter((employee) =>
              `${employee.name.firstName} ${employee.name.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
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
                    `${employee.name.firstName} ${employee.name.lastName}`,
                  )
                }
              >
                {highlightSearchTerm(
                  `${employee.name.firstName} ${employee.name.lastName}`,
                  searchQuery,
                )}
              </li>
            ))}
        </ul>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SSN</th>
            <th>Work Authorization Title</th>
            <th>Phone Number</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "light-row" : "dark-row"}
            >
              <td>
                <a
                  href="#"
                  onClick={() => handleOpenModal(employee)} // Use this to open modal for the clicked employee
                  style={{ color: "black", cursor: "pointer" }}
                >
                  {employee.name.firstName} {employee.name.lastName}
                </a>
              </td>
              <td>{employee.SSN}</td>
              <td>{employee["Work Authorization Title"]}</td>
              <td>{employee["Phone Number"]}</td>
              <td>{employee["Email"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />

      {/* Render the modal */}
      <EmployeeProfileModel isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1>Hello</h1>
      </EmployeeProfileModel>
    </div>
  );
};

export default EmployeeSummaryView;
