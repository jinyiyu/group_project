import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Avatar, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputField from "../components/InputField";
import LineDivider from "../components/LineDivider";
import InformationSection from "../components/InformationSection";
import DocumentGallery from "../components/DocumentGallery";

function PersonalInfoView({ user }) {
  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  return (
    <>
      <form className="name">
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
            value={user.userProfile.firstName}
            readOnly
          />

          <InputField
            fullWidth={true}
            name="userProfile.lastName"
            label="Last Name"
            value={user.userProfile.lastName}
            readOnly
          />

          <InputField
            fullWidth={true}
            name="userProfile.middleName"
            label="Middle Name"
            value={user.userProfile.middleName}
            readOnly
          />

          <InputField
            fullWidth={true}
            name="userProfile.preferredName"
            label="Preferred Name"
            value={user.userProfile.preferredName}
            readOnly
          />

          <Typography variant="subtitle1">Your Profile</Typography>
          {/* {documents.profilePicture !== "" ? (
            <Avatar
              src={documents.profilePicture}
              alt="Profile"
              sx={{ width: "8vw", height: "8vw", objectFit: "cover" }}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100, bgcolor: "grey.300" }} />
          )} */}

          <InputField
            fullWidth={true}
            name="userProfile.email"
            label="Email"
            value={user.userProfile.email}
            readOnly
          />

          <InputField
            fullWidth={true}
            name="userProfile.SSN"
            label="SSN"
            value={user.userProfile.SSN}
            readOnly
          />

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Date of Birth"
            type="date"
            name="userProfile.DoB"
            value={user.userProfile.DoB?.split("T")[0]}
            readOnly
          />

          <Select
            sx={{ height: "4vh", width: "100%" }}
            value={user.userProfile.gender}
            name="userProfile.gender"
            disabled
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">I do not wish to answer</MenuItem>
          </Select>
        </Box>
      </form>

      <InformationSection
        sectionName="address"
        labelName="Address"
        showEditButton={false}
      />
      <InformationSection
        sectionName="contactInfo"
        labelName="Contact Information"
        showEditButton={false}
      />
      <InformationSection
        sectionName="employment"
        labelName="Visa Status"
        showEditButton={false}
      />

      <LineDivider label="Emergency Contact" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "3vh",
          maxWidth: "50vw",
          ml: "25vw",
        }}
      >
        {user.emergencyContact.map((contact) => (
          <div key={contact.email}>
            <h3>{`Emergency Contact: ${contact.firstName} ${contact.lastName}`}</h3>
            {Object.entries(contact)
              .filter(([field]) => field !== "_id")
              .map(([field, value]) => (
                <TextField
                  key={`${contact.email}-${field}`}
                  fullWidth
                  sx={{ mt: "2vh" }}
                  size="small"
                  variant="outlined"
                  label={transformString(field)}
                  value={value}
                  readOnly
                />
              ))}
          </div>
        ))}
      </Box>

      <LineDivider label="Uploaded Documents" />

      {/* <DocumentGallery /> */}
    </>
  );
}

export default PersonalInfoView;
