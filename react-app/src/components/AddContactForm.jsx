import { useCallback, useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEmergencyContact } from "../store/userSlice/userSlice";
import TextField from "@mui/material/TextField";

function AddContactForm() {
  const contactFields = [
    { name: "firstName", required: true },
    { name: "lastName", required: true },
    { name: "middleName", required: false },
    { name: "phone", type: "tel", required: true },
    { name: "email", type: "email", required: true },
    { name: "relationship", required: true },
  ];

  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    email: "",
    relationship: "",
  });
  const dispatch = useDispatch();

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const addContact = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(addEmergencyContact({ ...contact }));
      setContact({
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      });
    },
    [dispatch, addEmergencyContact, setContact, contact],
  );

  return (
    <>
      <form className="addContact" onSubmit={addContact}>
        <h2>New Emergency Contact</h2>
        {contactFields.map(({ name, type = "text", required }) => (
          <div key={name}>
            <TextField
              id="outlined-basic"
              size="small"
              variant="outlined"
              label={transformString(name)}
              type={type}
              name={name}
              value={contact[name] || ""}
              onChange={handleContactChange}
              required={required}
              
            ></TextField>
           
          </div>
        ))}
        <button className="addContact" type="submit">
          Add Contact
        </button>
      </form>
    </>
  );
}

export default memo(AddContactForm);
