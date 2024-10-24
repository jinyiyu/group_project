import { memo } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";

function InputField({
  name,
  label,
  type = "text",
  onChange,
  required,
  fullWidth = false,
  readOnly = false,
}) {
  const user = useSelector((state) => state.user);
  const fields = name.split(".");

  return (
    <TextField
      fullWidth={fullWidth}
      size="small"
      variant="outlined"
      label={label}
      type={type}
      name={name}
      value={fields.length > 1 ? user[fields[0]][fields[1]] : user[fields[0]]}
      onChange={onChange}
      slotProps={{
        input: {
          readOnly: readOnly,
        },
      }}
      required={required}
    ></TextField>
  );
}

export default memo(InputField);
