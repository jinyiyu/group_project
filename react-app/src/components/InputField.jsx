import { memo } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";

function InputField({ name, label, type = "text", onChange, required }) {
  const user = useSelector((state) => state.user);
  const fields = name.split(".");

  return (
    <TextField
      size="small"
      variant="outlined"
      label={label}
      type={type}
      name={name}
      value={fields.length > 1 ? user[fields[0]][fields[1]] : user[fields[0]]}
      onChange={onChange}
      required={required}
    ></TextField>
  );
}

export default memo(InputField);
