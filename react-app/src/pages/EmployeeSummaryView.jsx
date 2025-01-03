import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/employeeSummaryView.css";
import EmployeeProfileModel from "../components/EmployeeProfileModel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import PaginationControl from "../components/PaginationControl.jsx";
import { fetchEmployees } from "../store/employeeSlice/employee.thunk";
import { fetchUserByIdThunk } from "../store/userSlice/userThunks.js";
import { selectDisplayedEmployees } from "../store/employeeSlice/employee.selectors";
import PersonalInfoView from "./personalInfoView.jsx";

const EmployeeSummaryView = () => {
  const dispatch = useDispatch();
  const displayedEmployees = useSelector(selectDisplayedEmployees);
  console.log("displayedEmployees:", displayedEmployees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const sortedEmployees = [...displayedEmployees].sort((a, b) =>
    a.name.lastName.localeCompare(b.name.lastName)
  );

  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 20;

  const totalPages = Math.ceil(displayedEmployees.length / employeesPerPage);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (id) => {
    console.log("Selected employee ID:", id);

    dispatch(fetchUserByIdThunk(id))
      .unwrap() // This allows you to handle the promise
      .then((result) => {
        console.log("Fetch user by ID successful:", result);
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
    <div className="employee-container">
      <h1>Summary View</h1>
      <SearchBar />
      <EmployeeTable
        employees={currentEmployees}
        onOpenModal={handleOpenModal}
      />
      <PaginationControl
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
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

export default EmployeeSummaryView;
