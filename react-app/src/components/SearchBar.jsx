import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  setDropdownVisible,
  setDisplayedEmployees,
} from "../store/employeeSlice/employeeSlice";
import {
  selectAllEmployees,
  selectSearchQuery,
  selectDropdownVisible,
} from "../store/employeeSlice/employee.selectors";

const SearchBar = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selectAllEmployees);
  const searchQuery = useSelector(selectSearchQuery);
  const dropdownVisible = useSelector(selectDropdownVisible);

  const handleSearch = () => {
    const filteredEmployees = employees.filter((employee) =>
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
          {employees
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
  );
};

export default SearchBar;
