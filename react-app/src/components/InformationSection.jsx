import { useEffect, useCallback, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TextField} from "@mui/material";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { updateField } from "../store/userSlice/userSlice";
import {
  validateUserData,
  updateBackendUser,
} from "../store/userSlice/userUtils";
import LineDivider from "./LineDivider";
import StateSelector from "./StateSelector";

function InformationSection({ sectionName, labelName }) {
  const BASE_URL = "http://localhost:3000";
  const dispatch = useDispatch();
  const [mode, setMode] = useState("view");
  const user = useSelector((state) => state.user);
  const fields = Object.keys(user[sectionName]).filter((f) => f !== "_id");
  const requiredFields = [
    "apt",
    "strName",
    "city",
    "state",
    "zip",
    "cellPhone",
    "start",
    "status",
    "end",
  ];

  function transformString(str) {
    let result = str.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  useEffect(() => {
    const inputs = document.querySelectorAll(`input.${sectionName}`);
    if (mode == "view") {
      inputs.forEach((input) => {
        input.disabled = true;
      });
    } else {
      inputs.forEach((input) => {
        input.disabled = false;
      });
    }
  }, [mode]);

  useEffect(() => {
    const buttons = document.querySelectorAll(`button.${sectionName}`);
    if (sectionName == "employment") {
      buttons.forEach((button) => {
        button.disabled = true;
      });
    }
  }, [sectionName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name, value: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errors = validateUserData(user);
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      await updateBackendUser(user, false);
      setMode("view");
      dispatch(fetchUserThunk());
    },
    [dispatch, user],
  );

  const handleEdit = (e) => {
    e.preventDefault();
    setMode("edit");
  };

  const handleCancel = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(fetchUserThunk());
      setMode("view");
    },
    [dispatch, setMode],
  );
  console.log(fields)

  return (
    <>
      <LineDivider label={labelName} />

      <form onSubmit={handleSubmit}>
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
          {fields.map((field, index) => {return field!=="state"? (
            <TextField
              key={field}
              fullWidth
              size="small"
              variant="outlined"
              label={transformString(field)}
              type="text"
              name={`${sectionName}.${field}`}
              value={user[sectionName][field]}
              onChange={handleChange}
              slotProps={{
                input: {
                  readOnly: mode == "view",
                },
              }}
              required={requiredFields.includes(field) ? true : false}
            ></TextField>
          ): (<StateSelector disabled={mode=="view"} width={"100%"}/>)})}
          {mode == "edit" ? (
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
                  className={sectionName}
                  sx={{ mr: "4px" }}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  className={sectionName}
                  onClick={handleCancel}
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
                  className={sectionName}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </Box>
            </>
          )}
        </Box>
      </form>
    </>
  );
}

export default memo(InformationSection);
