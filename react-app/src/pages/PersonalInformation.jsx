import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import {
  addEmergencyContact,
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import UserForm from "../components/UserForm";
import DocumentGallery from "../components/DocumentGallery";
import Feedback from "../components/Feedback";
import InformationSection from "../components/InformationSection";

function PersonalInformation() {
  const dispatch = useDispatch();
  const sections = ["userProfile", "address", "contactInfo", "employment"]
  const user = useSelector((state) => state.user);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    email: "",
    relationship: "",
  });

  useEffect(() => {
    dispatch(fetchUserThunk());
    dispatch(fetchDocumentThunk());
  }, []);

  const addContact = (e) => {
    e.preventDefault();
    const copy = contact;
    dispatch(addEmergencyContact(copy));
    setContact({
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      email: "",
      relationship: "",
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };


  return (
    <>
    {sections.map((section, index) => (
      <InformationSection key={section} sectionName={section}></InformationSection>
    ))}

    {user.emergencyContact.map((contact, index) => (
      <div key={contact.email}>
        {Object.entries(contact).map(([field, value]) => (
          <div key={`${contact.email}-${field}`}>
            <label
              htmlFor={`emergencyContact.${field}`}
            >{`Emergency Contact ${field}`}</label>
            <input
              type="text"
              name={`emergencyContact.${field}`}
              value={value}
              readOnly
            />
            <br />
          </div>
        ))}
        <button
          onClick={() => dispatch(deleteEmergencyContact(contact.email))}
          disabled={user.emergencyContact.length === 1}
        >
          Delete
        </button>
      </div>
    ))}

    <form onSubmit={addContact}>
      <label htmlFor="firstName">Emergency Contact First Name</label>
      <input
        type="text"
        name="firstName"
        value={contact.firstName}
        onChange={handleContactChange}
        required
      />
      <br />

      <label htmlFor="lastName">Emergency Contact Last Name</label>
      <input
        type="text"
        name="lastName"
        value={contact.lastName}
        onChange={handleContactChange}
        required
      />
      <br />

      <label htmlFor="middleName">Emergency Contact Middle Name</label>
      <input
        type="text"
        name="middleName"
        value={contact.middleName}
        onChange={handleContactChange}
      />
      <br />

      <label htmlFor="phone">Emergency Contact Phone</label>
      <input
        type="tel"
        name="phone"
        value={contact.phone}
        onChange={handleContactChange}
        required
      />
      <br />

      <label htmlFor="email">Emergency Contact Email</label>
      <input
        type="text"
        name="email"
        value={contact.email}
        onChange={handleContactChange}
        required
      />
      <br />

      <label htmlFor="relationship">Relationship</label>
      <input
        type="text"
        name="relationship"
        value={contact.relationship}
        onChange={handleContactChange}
        required
      />
      <br />
      <button type="submit">Add Contact</button>
    </form>
      
    <DocumentGallery></DocumentGallery>
    </>
  );
}

export default PersonalInformation;
