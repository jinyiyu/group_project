import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmployees } from "../redux/employeeSlice";

const EmployeeSummaryView = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.allEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchAndSetEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/employee/profile");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const employees = await response.json();
        console.log(employees);
        dispatch(setEmployees(employees));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchAndSetEmployees();
  }, [dispatch]);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((employee) =>
        `${employee.name.firstName} ${employee.name.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, employees]);

  // Sort employees alphabetically by last name
  const sortedEmployees = [...filteredEmployees].sort((a, b) =>
    a.name.lastName.localeCompare(b.name.lastName)
  );

  const handleSearch = () => {
    setFilteredEmployees(
      employees.filter((employee) =>
        `${employee.name.firstName} ${employee.name.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setDropdownVisible(false);
  };

  const handleDropdownClick = (name) => {
    setSearchQuery(name);
  };

  return (
    <div>
      <h1>Total Employees: {employees.length}</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setDropdownVisible(true);
        }}
      />
      <button onClick={handleSearch}>Search</button>
      {dropdownVisible && searchQuery && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {employees
            .filter((employee) =>
              `${employee.name.firstName} ${employee.name.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((employee, index) => (
              <li
                key={index}
                onClick={() =>
                  handleDropdownClick(
                    `${employee.name.firstName} ${employee.name.lastName}`
                  )
                }
              >
                {employee.name.firstName} {employee.name.lastName}
              </li>
            ))}
        </ul>
      )}
      <ul>
        {sortedEmployees.map((employee, index) => (
          <li key={index}>
            <strong>
              {employee.name.firstName} {employee.name.lastName}
            </strong>
            <p>SSN: {employee.SSN}</p>
            <p>
              Work Authorization Title: {employee["Work Authorization Title"]}
            </p>
            <p>Phone Number: {employee["Phone Number"]}</p>
            <p>Email: {employee["Email"]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSummaryView;
