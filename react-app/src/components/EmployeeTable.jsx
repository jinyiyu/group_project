import React from "react";

const EmployeeTable = ({ employees, onOpenModal }) => {
  return (
    <div>
      {employees.length === 0 ? (
        <p>No records found.</p>
      ) : (
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
            {employees.map((employee, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "light-row" : "dark-row"}
              >
                <td>
                  <a
                    href="#"
                    onClick={() => onOpenModal(employee)}
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
      )}
    </div>
  );
};

export default EmployeeTable;
