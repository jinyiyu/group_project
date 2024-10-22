import { useEffect, useCallback, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { updateField } from "../store/userSlice/userSlice";
import { updateDocument } from "../store/documentSlice/documentSlice";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";

function InformationSection({ sectionName }) {
  const BASE_URL = "http://localhost:3000";
  const dispatch = useDispatch();
  const [mode, setMode] = useState("view");
  const user = useSelector((state) => state.user);
  const fields = Object.keys(user[sectionName]).filter((f) => f !== "_id");

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
      const userRes = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: user }),
      });
      setMode("view");
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={field}>
            <label htmlFor={`${sectionName}.${field}`}>{field}</label>
            <input
              className={sectionName}
              type="text"
              name={`${sectionName}.${field}`}
              value={user[sectionName][field]}
              onChange={handleChange}
            />
            <br />
          </div>
        ))}

        {mode == "edit" ? (
          <>
            <button className={sectionName} type="submit">
              Save
            </button>
            <button className={sectionName} onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className={sectionName} onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
      </form>
    </>
  );
}

export default memo(InformationSection);
