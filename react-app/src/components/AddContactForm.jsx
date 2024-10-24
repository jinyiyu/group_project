import { useCallback, useState, memo } from "react";
import { useDispatch } from "react-redux";
import { addEmergencyContact } from "../store/userSlice/userSlice";
import { Button, TextField } from "@mui/material";

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
        {contactFields.map(({ name, type = "text", required }) => (
          <div key={name}>
            <TextField
              fullWidth
              sx={{ mb: "2vh" }}
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
        <Button
          variant="outlined"
          color="info"
          className="addContact"
          type="submit"
          fullWidth
        >
          Add Contact
        </Button>
      </form>
    </>
  );
}

export default memo(AddContactForm);
