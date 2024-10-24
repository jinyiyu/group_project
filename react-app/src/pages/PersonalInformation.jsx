import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Box,
  InputLabel,
  Avatar,
  Button,
  FormControl,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { updateDocument } from "../store/documentSlice/documentSlice";
import { uploadDocument } from "../store/documentSlice/documentUtils";
import {
  validateUserData,
  updateBackendUser,
} from "../store/userSlice/userUtils";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import {
  updateField,
  deleteEmergencyContact,
} from "../store/userSlice/userSlice";
import InputField from "../components/InputField";
import DocumentGallery from "../components/DocumentGallery";
import InformationSection from "../components/InformationSection";
import AddContactForm from "../components/AddContactForm";
import LineDivider from "../components/LineDivider";

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

  const handleSaveContact = async (e) => {
    e.preventDefault();
    const errors = validateUserData(user);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    await updateBackendUser(user, false);
    dispatch(fetchUserThunk);
    setModeContact("view");
  };
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
  const handleSaveName = async (e) => {
    e.preventDefault();
    const errors = validateUserData(user);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    await updateBackendUser(user, false);
    if (
      documents["profilePicture"] !== "" &&
      documents["profilePicture"].startsWith("https://bfgp.s3.amazonaws.com") ==
        false
    ) {
      await uploadDocument(documents, "profilePicture");
    }
    dispatch(fetchDocumentThunk);
    dispatch(fetchUserThunk);

    setModeName("view");
  };

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
        <LineDivider label="Basic Information" />

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

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Date of Birth"
            type="date"
            name="userProfile.DoB"
            value={user.userProfile.DoB?.split("T")[0]}
            onChange={handleChange}
            required
          ></TextField>

          <FormControl sx={{ width: "50vw" }} disabled={modeName == "view"}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              sx={{ height: "4vh" }}
              labelId="gender-label"
              value={user.userProfile.gender}
              onChange={handleChange}
              name="userProfile.gender"
              label="Gender"
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
            <Button
              variant="outlined"
              color="info"
              className="contact"
              onClick={handleEditContact}
            >
              Edit
            </Button>
          </>
        )}
      </Box>

      {modeContact == "edit" ? (
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

      <DocumentGallery></DocumentGallery>
    </>
  );
}

export default PersonalInformation;
