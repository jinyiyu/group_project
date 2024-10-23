import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Chip, Typography, Button, Input } from '@mui/material';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { updateDocument } from "../store/documentSlice/documentSlice";
import {
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import InputField from "./InputField";
import AddContactForm from "./AddContactForm";

const UserForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const documents = useSelector((state) => state.document);
  const [MUIDisabled, setMUIDisabled] = useState(false);
  const [showReference, setShowReference] = useState("no");
  const [showDriverLicense, setShowDriverLicense] = useState("no");
  const [other, setOther] = useState("");
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (user.onboardStatus == "pending") {
      disableAllInputs();
    }
  });

  useEffect(() => {
    if (user.employment.status !== "f1") {
      dispatch(updateDocument({ type: "OPT_receipt", url: "" }));
    }
  }, [user.employment.status]);

  useEffect(() => {
    if (
      user.driverLicense.number ||
      user.driverLicense.expirationDate ||
      user.driverLicense.licenseCopy
    ) {
      setShowDriverLicense("yes");
    }
  }, [user.driverLicense]);

  useEffect(() => {
    for (let key in user.reference) {
      if (key !== "_id" && user.reference[key] !== "") {
        setShowReference("yes");
        return;
      }
    }
  }, [user.reference]);

  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  const disableAllInputs = useCallback(() => {
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.disabled = true;
    });

    setMUIDisabled(true);
  });

  const handleStatusChange = useCallback((e) => {
    if (e.target.value == "yes") {
      dispatch(updateField({ field: "employment.status", value: "citizen" }));
    } else {
      dispatch(updateField({ field: "employment.status", value: "h1b" }));
    }
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name, value: value }));
  });

  const handleDocumentChange = async (e, type) => {
    const file = e.target.files[0];
    const base64File = await fileToBase64(file);
    let fileType = type;
    if (type.includes(".")) {
      fileType = type.split(".").pop();
    }
    dispatch(updateDocument({ type: fileType, url: base64File }));
  };

  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  });

  const uploadDocument = async (docName) => {
    const res = await fetch(`${BASE_URL}/document/upload?type=${docName}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64File: documents[docName],
      }),
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
  };

  const handleLicenseChange = (e) => {
    if (e.target.value == "no") {
      dispatch(updateField({ field: "driverLicense.number", value: "" }));
      dispatch(
        updateField({ field: "driverLicense.expirationDate", value: "" }),
      );
      dispatch(updateField({ field: "driverLicense.licenseCopy", value: "" }));
      dispatch(updateDocument({ type: "licenseCopy", url: "" }));
      setShowDriverLicense("no");
    } else {
      setShowDriverLicense("yes");
    }
  };

  const handleReferenceChange = (e) => {
    if (e.target.value == "no") {
      dispatch(updateField({ field: "reference.firstName", value: "" }));
      dispatch(updateField({ field: "reference.lastName", value: "" }));
      dispatch(updateField({ field: "reference.middleName", value: "" }));
      dispatch(updateField({ field: "reference.phone", value: "" }));
      dispatch(updateField({ field: "reference.email", value: "" }));
      dispatch(updateField({ field: "reference.relationship", value: "" }));
      setShowReference("no");
    } else {
      setShowReference("yes");
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const userRes = await fetch(`${BASE_URL}/user/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: user,
      }),
    });

    for (let docName in documents) {
      if (
        documents[docName] !== "" &&
        documents[docName].startsWith("https://bfgp.s3.amazonaws.com") == false
      ) {
        await uploadDocument(docName);
      }
    }
    if (!userRes.ok) {
      throw new Error("Network response was not ok");
    } else {
      //redirect to main page
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>section i</h1>

        <InputField
          name="userProfile.firstName"
          label="First Name"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="userProfile.lastName"
          label="Last Name"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="userProfile.middleName"
          label="Middle Name"
          onChange={handleChange}
          required={false}
        ></InputField>

        <InputField
          name="userProfile.preferredName"
          label="Preffered Name"
          onChange={handleChange}
          required={false}
        ></InputField>

        <h1>section ii</h1>

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

        <h1>section iii</h1>

        <InputField
          name="address.apt"
          label="Building/Apt #"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="address.strName"
          label="Street Name"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="address.city"
          label="City"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="address.state"
          label="State"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="address.zip"
          label="ZIP Code"
          onChange={handleChange}
          required={true}
        ></InputField>

        <h1>section iv</h1>

        <InputField
          name="contactInfo.cellPhone"
          type="tel"
          label="Cell Phone"
          onChange={handleChange}
          required={true}
        ></InputField>

        <InputField
          name="contactInfo.workPhone"
          type="tel"
          label="Work Phone"
          onChange={handleChange}
          required={false}
        ></InputField>

        <h1>section v</h1>

        <InputField
          name="car.model"
          label="Car Model"
          onChange={handleChange}
          required={false}
        ></InputField>

        <InputField
          name="car.color"
          label="Car Color"
          onChange={handleChange}
          required={false}
        ></InputField>

        <InputField
          name="car.make"
          label="Car Make"
          onChange={handleChange}
          required={false}
        ></InputField>

        <h1>section vi</h1>

        <TextField
          size="small"
          variant="outlined"
          label="Email"
          type="email"
          name="userProfile.email"
          value={user.userProfile.email}
          readOnly
          required
        ></TextField>

        <h1>section vii</h1>

        <InputField
          name="userProfile.SSN"
          label="SSN"
          onChange={handleChange}
          required={true}
        ></InputField>

        <TextField
          size="small"
          variant="outlined"
          label="Date of Birth"
          type="date"
          name="userProfile.DoB"
          value={user.userProfile.DoB?.split("T")[0]}
          onChange={handleChange}
          required
        ></TextField>

        <Select
          disabled={MUIDisabled}
          value={user.userProfile.gender}
          label="Gender"
          onChange={handleChange}
          name="userProfile.gender"
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">I do not wish to answer</MenuItem>
        </Select>

        <h1>section viii</h1>
        <Select
          value={
            user.employment.status == "citizen" ||
            user.employment.status == "green_card"
              ? "yes"
              : "no"
          }
          label="Are you a citizen or permanent resident of the U.S?"
          onChange={handleStatusChange}
          disabled={documents["OPT_receipt"].startsWith(
            "https://bfgp.s3.amazonaws.com",
          )}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>

        {user.employment.status == "citizen" ||
        user.employment.status == "green_card" ? (
          <>
            <Select
              disabled={
                MUIDisabled ||
                documents["OPT_receipt"].startsWith(
                  "https://bfgp.s3.amazonaws.com",
                )
              }
              value={user.employment.status}
              label="Citizen or Green Card Holders?"
              onChange={handleChange}
              name="employment.status"
            >
              <MenuItem value="citizen">Citizen</MenuItem>
              <MenuItem value="green_card">Green Card</MenuItem>
            </Select>
          </>
        ) : (
          <>
            <Select
              disabled={
                MUIDisabled ||
                documents["OPT_receipt"].startsWith(
                  "https://bfgp.s3.amazonaws.com",
                )
              }
              value={user.employment.status}
              label="Work Authorization"
              onChange={handleChange}
              name="employment.status"
            >
              <MenuItem value="h1b">H1-B</MenuItem>
              <MenuItem value="l2">L2</MenuItem>
              <MenuItem value="f1">{`F1(CPT/OPT)`}</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>

            <TextField
              size="small"
              variant="outlined"
              label="Start Date"
              type="date"
              name="employment.start"
              value={user.employment.start?.split("T")[0]}
              onChange={handleChange}
              required
            ></TextField>

            <TextField
              size="small"
              variant="outlined"
              label="End Date"
              type="date"
              name="employment.end"
              value={user.employment.end?.split("T")[0]}
              onChange={handleChange}
              required
            ></TextField>
          </>
        )}

        {/* button to visa status page only if user have uploaded opt receipt on last submission */}
        {user.employment.status == "f1" &&
        documents["OPT_receipt"] !== "" &&
        documents["OPT_receipt"].startsWith("https://bfgp.s3.amazonaws.com") &&
        user.onboardStatus !== "pending" ? (
          <>
            <button> TODO: to visa status page </button>
          </>
        ) : (
          <></>
        )}

        {/* input field to upload opt_receipt only if user choose f1 visa and have not uploaded one on last submission */}
        {user.employment.status == "f1" &&
        (documents["OPT_receipt"].startsWith("https://bfgp.s3.amazonaws.com") ==
          false ||
          documents["OPT_receipt"] == "") ? (
          <>
            <label htmlFor="OPT_receipt">{`Upload your OPT receipt`}</label>
            <input
              type="file"
              name="OPT_receipt"
              accept="image/*"
              onChange={(e) => handleDocumentChange(e, "OPT_receipt")}
              required
            />
            <br />
          </>
        ) : (
          <></>
        )}

        {user.employment.status == "other" ? (
          <>
            <TextField
              size="small"
              variant="outlined"
              label="Please specify"
              type="text"
              name="employment.status"
              value={other}
              onChange={(e) => {
                setOther(e.target.value);
              }}
              required
            ></TextField>
          </>
        ) : (
          <></>
        )}

        <h1>section ix</h1>
        <Select
          disabled={
            MUIDisabled ||
            documents["OPT_receipt"].startsWith("https://bfgp.s3.amazonaws.com")
          }
          value={showDriverLicense}
          label="Do you have a driver’s license?"
          onChange={handleLicenseChange}
          name="employment.status"
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>

        {showDriverLicense == "yes" ? (
          <>
            <InputField
              name="driverLicense.number"
              label="Plate Number #"
              onChange={handleChange}
              required={true}
            ></InputField>

            <TextField
              size="small"
              variant="outlined"
              label="Expiration Date"
              type="date"
              name="driverLicense.expirationDate"
              value={user.driverLicense.expirationDate?.split("T")[0]}
              onChange={handleChange}
              required
            ></TextField>

            {documents.licenseCopy !== "" ? (
              <img
                src={documents.licenseCopy}
                alt="licenseCopy"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            ) : (
              <></>
            )}

            <label htmlFor="driverLicense">Upload a new license copy</label>
            <input
              type="file"
              name="driverLicense"
              accept="image/*"
              onChange={(e) =>
                handleDocumentChange(e, "driverLicense.licenseCopy")
              }
              required={documents.licenseCopy == ""}
            />
            <br />
          </>
        ) : (
          <></>
        )}

        <h1>section x</h1>

        <Select
          disabled={MUIDisabled}
          value={showReference}
          label="Are you referred by anyone?"
          onChange={handleReferenceChange}
          name="userProfile.gender"
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>

        {showReference == "yes" ? (
          <>
            <InputField
              name="reference.firstName"
              label="First Name"
              onChange={handleChange}
              required={true}
            ></InputField>

            <InputField
              name="reference.lastName"
              label="Last Name"
              onChange={handleChange}
              required={true}
            ></InputField>

            <InputField
              name="reference.middleName"
              label="Middle Name"
              onChange={handleChange}
              required={false}
            ></InputField>

            <InputField
              name="reference.phone"
              type="tel"
              label="Phone"
              onChange={handleChange}
              required={true}
            ></InputField>

            <InputField
              name="reference.email"
              type="email"
              label="Email"
              onChange={handleChange}
              required={true}
            ></InputField>

            <InputField
              name="reference.relationship"
              label="Relationship"
              onChange={handleChange}
              required={true}
            ></InputField>
          </>
        ) : (
          <></>
        )}

        <h1>section xi</h1>

        {user.emergencyContact.map((contact, index) => (
          <div key={contact.email}>
            <h3>{`Emergency Contact: ${contact.firstName} ${contact.lastName}`}</h3>
            {Object.entries(contact)
              .filter(([field, _]) => field != "_id")
              .map(([field, value]) => (
                <div key={`${contact.email}-${field}`}>
                  <TextField
                    size="small"
                    variant="outlined"
                    label={`${transformString(field)}`}
                    type="text"
                    name={`emergencyContact.${field}`}
                    value={value}
                    readOnly
                  ></TextField>
                </div>
              ))}
            {user.onboardStatus !== "pending" ? (
              <button
                onClick={() => dispatch(deleteEmergencyContact(contact.email))}
                disabled={user.emergencyContact.length === 1}
              >
                Delete
              </button>
            ) : (
              <></>
            )}
          </div>
        ))}

        {user.onboardStatus !== "pending" ? (
          <button type="submit">Submit</button>
        ) : (
          <></>
        )}
      </form>

      {user.onboardStatus !== "pending" ? (
        <AddContactForm></AddContactForm>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserForm;
