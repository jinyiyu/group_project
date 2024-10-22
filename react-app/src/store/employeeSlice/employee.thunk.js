// housing.thunk.js
import { setEmployees } from "./employeeSlice";

export const fetchEmployees = () => async (dispatch) => {
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
