import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { Box, Chip, Divider, InputLabel } from "@mui/material";
import { Avatar, Button, FormControl, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import InputField from "../components/InputField";
import { updateDocument } from "../store/documentSlice/documentSlice";

import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import {
  addEmergencyContact,
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import DocumentGallery from "../components/DocumentGallery";
import InformationSection from "../components/InformationSection";
import AddContactForm from "../components/AddContactForm";

function PersonalInformation() {
  const BASE_URL = "http://localhost:3000";
  const [modeContact, setModeContact] = useState("view");
  const [modeName, setModeName] = useState("view");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const documents = useSelector((state) => state.document);

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

  const handleSaveContact = useCallback(
    async (e) => {
      e.preventDefault();
      const userRes = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: user }),
      });
      dispatch(fetchUserThunk);
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
        documents["profilePicture"].startsWith(
          "https://bfgp.s3.amazonaws.com",
        ) == false
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
              base64File: documents["profilePicture"],
            }),
          },
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
      }
      dispatch(fetchDocumentThunk);
      dispatch(fetchUserThunk);

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
        <Divider
          sx={{
            "&::before, &::after": {
              borderColor: "rgb(179,223,252)",
              borderWidth: "3px",
              borderRadius: "5px",
            },
            mt: "5vh",
            mb: "3vh",
          }}
        >
          <Chip variant="outlined" label="Basic Information" color="info" />
        </Divider>{" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2vh",
            maxWidth: "50vw",
            ml: "25vw",
          }}
        >
          <InputField
            fullWidth={true}
            name="userProfile.firstName"
            label="First Name"
            onChange={handleChange}
            value={user.userProfile.firstName}
            required={true}
          ></InputField>

          <InputField
            fullWidth={true}
            name="userProfile.lastName"
            label="Last Name"
            onChange={handleChange}
            value={user.userProfile.lastName}
            required={true}
          ></InputField>

          <InputField
            fullWidth={true}
            name="userProfile.middleName"
            label="Middle Name"
            onChange={handleChange}
            value={user.userProfile.middleName}
          ></InputField>

          <InputField
            fullWidth={true}
            name="userProfile.preferredName"
            label="Preferred Name"
            onChange={handleChange}
            value={user.userProfile.preferredName}
          ></InputField>

          <Typography variant="subtitle1">Your Profile</Typography>
          {documents.profilePicture !== "" ? (
            <Avatar
              src={documents.profilePicture}
              alt="Profile"
              sx={{ width: "8vw", height: "8vw", objectFit: "cover" }} // Using Avatar for better styling
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100, bgcolor: "grey.300" }} /> // Placeholder avatar if no picture
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

          <InputField
            fullWidth={true}
            name="userProfile.email"
            label="Email"
            onChange={handleChange}
            value={user.userProfile.email}
            readOnly={true}
            required={true}
          ></InputField>

          <InputField
            fullWidth={true}
            name="userProfile.SSN"
            label="SSN"
            onChange={handleChange}
            value={user.userProfile.SSN}
            readOnly={true}
            required={true}
          ></InputField>

          <InputField
            fullWidth={true}
            type="date"
            name="userProfile.DoB"
            label="Date of Birth"
            onChange={handleChange}
            value={user.userProfile.DoB?.split("T")[0]}
            required={true}
          ></InputField>

          <FormControl sx={{ width: "50vw" }} disabled={modeName == "view"}>
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

          {modeName == "edit" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  width: "50vw",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  color="info"
                  className="name"
                  sx={{ mr: "4px" }}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  className="name"
                  onClick={handleCancelName}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  width: "50vw",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  color="info"
                  className="name"
                  onClick={handleEditName}
                >
                  Edit
                </Button>
              </Box>
            </>
          )}
        </Box>
      </form>
      <InformationSection
        sectionName={"address"}
        labelName={"Address"}
      ></InformationSection>
      <InformationSection
        sectionName={"contactInfo"}
        labelName={"Contact Information"}
      ></InformationSection>
      <InformationSection
        sectionName={"employment"}
        labelName={"Visa Status"}
      ></InformationSection>
      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "rgb(179,223,252)",
            borderWidth: "3px",
            borderRadius: "5px",
          },
          mt: "5vh",
          mb: "3vh",
        }}
      >
        <Chip variant="outlined" label="Emergency Contact" color="info" />
      </Divider>{" "}
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
            {modeContact == "edit" ? (
              <Button
                variant="outlined"
                color="info"
                sx={{ width: "100%", mt: "2vh" }}
                onClick={() => dispatch(deleteEmergencyContact(contact.email))}
                disabled={user.emergencyContact.length === 1}
              >
                Delete
              </Button>
            ) : (
              <></>
            )}
          </div>
        ))}

{modeContact == "edit" ? (
        <>
          <Box
            sx={{
              display: "flex",
              width: "50vw",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="info"
              className="contact"
              sx={{ mr: "4px" }}
              onClick={handleSaveContact}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="info"
              className="contact"
              onClick={handleCancelContact}
            >
              Cancel
            </Button>
          </Box>

          
        </>
      ) : (
        <>
          <Button variant="outlined"
              color="info"
              className="contact" onClick={handleEditContact}>
            Edit
          </Button>
        </>
      )}
      </Box>

      {modeContact=="edit"? (<><Divider
            sx={{
              "&::before, &::after": {
                borderColor: "rgb(179,223,252)",
                borderWidth: "3px",
                borderRadius: "5px",
              },
              mt: "5vh",
              mb: "3vh",
            }}
          >
            <Chip
              variant="outlined"
              label="Add Emergency Contact"
              color="info"
            />
          </Divider>
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
          </Box></>):(<></>)}
      

      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "rgb(179,223,252)",
            borderWidth: "3px",
            borderRadius: "5px",
          },
          mt: "5vh",
          mb: "3vh",
        }}
      >
        <Chip variant="outlined" label="Uploaded Documents" color="info" />
      </Divider>
      <DocumentGallery></DocumentGallery>
    </>
  );
}

export default PersonalInformation;