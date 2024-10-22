import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import {
  addEmergencyContact,
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import DocumentGallery from "../components/DocumentGallery";
import InformationSection from "../components/InformationSection";

function PersonalInformation() {
  const BASE_URL = "http://localhost:3000";
  const contactFields = [
    { name: "firstName", required: true },
    { name: "lastName", required: true },
    { name: "middleName", required: false },
    { name: "phone", type: "tel", required: true },
    { name: "email", type: "email", required: true },
    { name: "relationship", required: true },
  ];
  const [modeContact, setModeContact] = useState("view");
  const [modeName, setModeName] = useState("view");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const documents = useSelector((state) => state.document);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    email: "",
    relationship: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name, value: value }));
  };

  useEffect(() => {
    dispatch(fetchUserThunk());
    dispatch(fetchDocumentThunk());
  }, []);

  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  });

  const handleDocumentChange = async (e) => {
    const file = e.target.files[0];
    const base64File = await fileToBase64(file);
    let fileType = e.target.name;
    dispatch(updateDocument({ type: fileType, url: base64File }));
  };

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

  const handleSaveContact = useCallback(
    async (e) => {
      e.preventDefault();
      const userRes = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: user }),
      });
      setModeContact("view");
    },
    [dispatch, user],
  );

  const handleEditContact = (e) => {
    e.preventDefault();
    setModeContact("edit");
  };

  const handleCancelContact = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(fetchUserThunk());
      setModeContact("view");
    },
    [dispatch, setModeContact],
  );

  const handleSaveName = useCallback(
    async (e) => {
      e.preventDefault();
      const userRes = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: user }),
      });

      if (
        documents["profilePicture"] !== "" &&
        documents["profilePicture"].startsWith("https://bfgp.s3.amazonaws.com") == false
      ) {
        const res = await fetch(
          `${BASE_URL}/document/upload?type=profilePicture`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              base64File: documents[profilePicture],
            }),
          },
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
      }

      setModeName("view");
    },
    [dispatch, user],
  );

  const handleEditName = (e) => {
    e.preventDefault();
    setModeName("edit");
  };

  const handleCancelName = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(fetchUserThunk());
      dispatch(fetchDocumentThunk());
      setModeName("view");
    },
    [dispatch, setModeName],
  );

  useEffect(() => {
    const nameInputs = document.querySelectorAll(
      "form.name input, form.name select",
    );

    if (modeName == "view") {
      nameInputs.forEach((input) => {
        input.disabled = true;
      });
    } else {
      nameInputs.forEach((input) => {
        input.disabled = false;
      });
    }
  }, [modeName]);

  return (
    <>
      <form className="name" onSubmit={handleSaveName}>
        <label htmlFor="userProfile.firstName">First Name</label>
        <input
          type="text"
          name="userProfile.firstName"
          value={user.userProfile.firstName}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="userProfile.lastName">Last Name</label>
        <input
          type="text"
          name="userProfile.lastName"
          value={user.userProfile.lastName}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="userProfile.middleName">Middle Name</label>
        <input
          type="text"
          name="userProfile.middleName"
          value={user.userProfile.middleName}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="userProfile.preferredName">Preferred Name</label>
        <input
          type="text"
          name="userProfile.preferredName"
          value={user.userProfile.preferredName}
          onChange={handleChange}
        />
        <br />

        {documents.profilePicture !== "" ? (
          <img
            src={documents.profilePicture}
            alt="Profile"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ) : (
          <></>
        )}
        <label htmlFor="profilePicture">Upload a new profile picture</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={(e) =>
            handleDocumentChange(e, "userProfile.profilePicture")
          }
        />
        <br />

        <label htmlFor="userProfile.email">Email</label>
        <input
          type="email"
          name="userProfile.email"
          value={user.userProfile.email}
          readOnly
        />
        <br />

        <label htmlFor="userProfile.SSN">SSN</label>
        <input
          type="text"
          name="userProfile.SSN"
          value={user.userProfile.SSN}
          readOnly
        />
        <br />

        <label htmlFor="userProfile.DoB">Date of Birth</label>
        <input
          type="date"
          name="userProfile.DoB"
          value={user.userProfile.DoB?.split("T")[0]}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="userProfile.gender">Gender</label>
        <select
          name="userProfile.gender"
          value={user.userProfile.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">I do not wish to answer</option>
        </select>
        <br />

        {modeName == "edit" ? (
          <>
            <button className="name" type="submit">
              Save
            </button>
            <button className="name" onClick={handleCancelName}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="name" onClick={handleEditName}>
              Edit
            </button>
          </>
        )}
      </form>

      <InformationSection sectionName={"address"}></InformationSection>
      <InformationSection sectionName={"contactInfo"}></InformationSection>
      <InformationSection sectionName={"employment"}></InformationSection>

      {user.emergencyContact.map((contact, index) => (
        <div key={contact.email}>
          <h3>{`Emergency Contact: ${contact.firstName} ${contact.lastName}`}</h3>
          {Object.entries(contact)
            .filter(([field, _]) => field != "_id")
            .map(([field, value]) => (
              <div key={`${contact.email}-${field}`}>
                <label
                  htmlFor={`emergencyContact.${field}`}
                >{`${transformString(field)}`}</label>
                <input
                  className="contact"
                  type="text"
                  name={`emergencyContact.${field}`}
                  value={value}
                  readOnly
                />
                <br />
              </div>
            ))}
          <button
            className="contact"
            onClick={() => dispatch(deleteEmergencyContact(contact.email))}
            disabled={user.emergencyContact.length === 1}
          >
            Delete
          </button>
        </div>
      ))}

      {modeContact == "edit" ? (
        <>
          <button className="contact" onClick={handleSaveContact}>
            Save
          </button>
          <button className="contact" onClick={handleCancelContact}>
            Cancel
          </button>

          <form className="addContact" onSubmit={addContact}>
            <h2>Add New Emergency Contact</h2>
            {contactFields.map(({ name, type = "text", required }) => (
              <div key={name}>
                <label htmlFor={name}>{transformString(name)}</label>
                <input
                  className="addContact"
                  type={type}
                  name={name}
                  value={contact[name] || ""}
                  onChange={handleContactChange}
                  required={required}
                />
                <br />
              </div>
            ))}
            <button className="addContact" type="submit">
              Add Contact
            </button>
          </form>
        </>
      ) : (
        <>
          <button className="contact" onClick={handleEditContact}>
            Edit
          </button>
        </>
      )}

      <DocumentGallery></DocumentGallery>
    </>
  );
}

export default PersonalInformation;
