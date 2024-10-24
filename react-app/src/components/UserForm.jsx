import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Chip, Divider, InputLabel } from "@mui/material";
import { Avatar, Button, FormControl, Typography } from "@mui/material";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { updateDocument } from "../store/documentSlice/documentSlice";
import validateUserData from "../store/userSlice/userValidator";
import {
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import InputField from "./InputField";
import AddContactForm from "./AddContactForm";
import LineDivider from "./LineDivider";
import "../assets/styles/onBoarding.css";

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
    const errors = validateUserData(user);
    if (errors.length> 0) {
      alert(errors.join("\n"));
      return;
    }
    const userRes = await fetch(`${BASE_URL}/user/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: user,
        fromOnBoard: true,
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
      dispatch(fetchUserThunk());
      dispatch(fetchDocumentThunk());
      window.location.reload();
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <LineDivider label="Name"></LineDivider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <InputField
            name="userProfile.firstName"
            label="First Name"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="userProfile.lastName"
            label="Last Name"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="userProfile.middleName"
            label="Middle Name"
            onChange={handleChange}
            required={false}
          />

          <InputField
            name="userProfile.preferredName"
            label="Preffered Name"
            onChange={handleChange}
            required={false}
          />
        </Box>
        <LineDivider label="Profile Picture"></LineDivider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2vh",
          }}
        >
          {documents.profilePicture !== "" ? (
            <Avatar
              src={documents.profilePicture}
              alt="Profile"
              sx={{ width: "8vw", height: "8vw", objectFit: "cover" }}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100, bgcolor: "grey.300" }} />
          )}
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={(e) =>
              handleDocumentChange(e, "userProfile.profilePicture")
            }
            id="upload-profile-picture"
          />
        </Box>
        <LineDivider label="Address"></LineDivider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <InputField
            name="address.apt"
            label="Building/Apt #"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="address.strName"
            label="Street Name"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="address.city"
            label="City"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="address.state"
            label="State"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="address.zip"
            label="ZIP Code"
            onChange={handleChange}
            required={true}
          />
        </Box>
        <LineDivider label="Phone"></LineDivider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <InputField
            name="contactInfo.cellPhone"
            type="tel"
            label="Cell Phone"
            onChange={handleChange}
            required={true}
          />

          <InputField
            name="contactInfo.workPhone"
            type="tel"
            label="Work Phone"
            onChange={handleChange}
            required={false}
          />
        </Box>
        <LineDivider label="Car"></LineDivider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <InputField
            name="car.model"
            label="Car Model"
            onChange={handleChange}
            required={false}
          />

          <InputField
            name="car.color"
            label="Car Color"
            onChange={handleChange}
            required={false}
          />

          <InputField
            name="car.make"
            label="Car Make"
            onChange={handleChange}
            required={false}
          />
        </Box>
        <LineDivider label="Email" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <TextField
            size="small"
            sx={{
              width: "18vw",
            }}
            variant="outlined"
            label="Email"
            type="email"
            name="userProfile.email"
            value={user.userProfile.email}
            readOnly
            required
          ></TextField>
        </Box>
        <LineDivider label="Others" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mx: "auto",
            spacing: "2vw",
          }}
        >
          <InputField
            name="userProfile.SSN"
            label="SSN"
            onChange={handleChange}
            required={true}
          />

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

          <FormControl
            sx={{ width: "8vw" }}
            variant="outlined"
            disabled={MUIDisabled}
          >
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              sx={{ height: "4vh" }}
              labelId="gender-label"
              value={user.userProfile.gender}
              onChange={handleChange}
              name="userProfile.gender"
              label="Gender" // This label is for accessibility purposes
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">I do not wish to answer</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <LineDivider label="Visa Status" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "3vh",
            maxWidth: "50vw",
            justifyContent: "center",
            ml: "25vw",
          }}
        >
          <div>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Are you a citizen or permanent resident of the U.S.?
            </Typography>
            <Select
              fullWidth
              sx={{ height: "4.5vh" }}
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
          </div>

          {user.employment.status == "citizen" ||
          user.employment.status == "green_card" ? (
            <>
              <div>
                <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                  Citizen or Green Card Holders?
                </Typography>
                <Select
                  fullWidth
                  sx={{ height: "4.5vh" }}
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
              </div>
            </>
          ) : (
            <>
              <div>
                <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                  What is your visa status?
                </Typography>
                <Select
                  fullWidth
                  sx={{ height: "4.5vh" }}
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
              </div>

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
          documents["OPT_receipt"].startsWith(
            "https://bfgp.s3.amazonaws.com",
          ) ? (
            <>
              <Button variant="outlined" color="info">
                track your visa status
              </Button>
            </>
          ) : (
            <></>
          )}

          {/* input field to upload opt_receipt only if user choose f1 visa and have not uploaded one on last submission */}
          {user.employment.status == "f1" &&
          (documents["OPT_receipt"].startsWith(
            "https://bfgp.s3.amazonaws.com",
          ) == false ||
            documents["OPT_receipt"] == "") ? (
            <>
              {documents.OPT_receipt !== "" ? (
                <img src={documents.OPT_receipt} alt="Profile" />
              ) : (
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  uploaded image will be displayed here
                </Typography>
              )}

              <input
                type="file"
                name="OPT_receipt"
                accept="image/*"
                onChange={(e) => handleDocumentChange(e, "OPT_receipt")}
                required
                id="upload-opt-receipt"
              />
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
        </Box>
        <LineDivider label="Driver License" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "3vh",
            maxWidth: "50vw",
            justifyContent: "center",
            ml: "25vw",
          }}
        >
          <div>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Do you have a driver’s license?
            </Typography>

            <Select
              fullWidth
              sx={{ height: "4.5vh" }}
              value={showDriverLicense}
              label="Do you have a driver’s license?"
              onChange={handleLicenseChange}
              name="employment.status"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </div>

          {showDriverLicense == "yes" ? (
            <>
              <InputField
                name="driverLicense.number"
                label="Plate Number #"
                onChange={handleChange}
                required={true}
              />

              <TextField
                size="small"
                variant="outlined"
                label="Expiration Date"
                type="date"
                name="driverLicense.expirationDate"
                value={user.driverLicense.expirationDate ? user.driverLicense.expirationDate.split("T")[0] : "2024-10-26"}
                onChange={handleChange}
                required
              ></TextField>

              {documents.licenseCopy !== "" ? (
                <img src={documents.licenseCopy} alt="License Copy" />
              ) : (
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  uploaded image will be displayed here
                </Typography>
              )}

              <input
                type="file"
                name="licenseCopy"
                accept="image/*"
                onChange={(e) =>
                  handleDocumentChange(e, "driverLicense.licenseCopy")
                }
                required={
                  user.driverLicense.number !== "" &&
                  documents.licenseCopy == ""
                }
                id="upload-license-copy"
              />
            </>
          ) : (
            <></>
          )}
        </Box>
        <LineDivider label="Reference" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "3vh",
            maxWidth: "50vw",
            justifyContent: "center",
            ml: "25vw",
          }}
        >
          <div>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Are you referred by anyone?
            </Typography>
            <Select
              fullWidth
              sx={{ height: "4.5vh" }}
              disabled={MUIDisabled}
              value={showReference}
              label="Are you referred by anyone?"
              onChange={handleReferenceChange}
              name="userProfile.gender"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </div>

          {showReference == "yes" ? (
            <>
              <InputField
                name="reference.firstName"
                label="First Name"
                onChange={handleChange}
                required={true}
              />

              <InputField
                name="reference.lastName"
                label="Last Name"
                onChange={handleChange}
                required={true}
              />

              <InputField
                name="reference.middleName"
                label="Middle Name"
                onChange={handleChange}
                required={false}
              />

              <InputField
                name="reference.phone"
                type="tel"
                label="Phone"
                onChange={handleChange}
                required={true}
              />

              <InputField
                name="reference.email"
                type="email"
                label="Email"
                onChange={handleChange}
                required={true}
              />

              <InputField
                name="reference.relationship"
                label="Relationship"
                onChange={handleChange}
                required={true}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
        <LineDivider label="Emergency Contact" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "3vh",
            maxWidth: "50vw",
            justifyContent: "center",
            ml: "25vw",
          }}
        >
          {user.emergencyContact.map((contact, index) => (
            <div key={contact.email}>
              <h3>{`Emergency Contact: ${contact.firstName} ${contact.lastName}`}</h3>
              {Object.entries(contact)
                .filter(([field, _]) => field != "_id")
                .map(([field, value]) => (
                  <div key={`${contact.email}-${field}`}>
                    <TextField
                      fullWidth
                      sx={{ mt: "2vh" }}
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
                <Button
                  variant="outlined"
                  color="info"
                  sx={{ width: "100%", mt: "2vh" }}
                  onClick={() =>
                    dispatch(deleteEmergencyContact(contact.email))
                  }
                  disabled={user.emergencyContact.length === 1}
                >
                  Delete
                </Button>
              ) : (
                <></>
              )}
            </div>
          ))}
        </Box>
        {user.onboardStatus !== "pending" ? (
          <>
            <LineDivider label="End of Application" />
            <Button
              variant="contained"
              color="info"
              type="submit"
              sx={{ display: "block", margin: "0 auto", width: "50vw" }}
            >
              Submit Onboarding Form
            </Button>
          </>
        ) : (
          <></>
        )}{" "}
      </form>

      {user.onboardStatus !== "pending" ? (
        <>
          <LineDivider label="Add Emergency Contact" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "3vh",
              maxWidth: "50vw",
              justifyContent: "center",
              ml: "25vw",
            }}
          >
            <AddContactForm></AddContactForm>
          </Box>
        </>
      ) : (
        <></>
      )}

      <LineDivider label="Uploaded Documents" />
    </>
  );
};

export default UserForm;
