import { useEffect, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
} from "../store/userSlice/userSlice";
import { updateDocument } from "../store/documentSlice/documentSlice";


function InformationSection({sectionName}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const documents = useSelector((state) => state.document);
  const dateFields = ["DoB", "start", "end"];
  let fields = Object.keys(user[sectionName]);
  fields = fields.filter(f => (f !== "_id" && f != "profilePicture"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name, value: value }));
  };

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

  return (
    <>
    {fields.map((field, index) => (
      <div key={field}>
        <label htmlFor={`${sectionName}.${field}`}>{field}</label>
        <input
          type={dateFields.includes(field) ? "date" : "text"}
          name={`${sectionName}.${field}`}
          value={user[sectionName][field]}
          onChange={handleChange}
        />
        <br />
      </div>)
    )}

    {sectionName=="userProfile"? (
      <>
        {documents.profilePicture !== "" ? (
          <img
            src={documents.profilePicture}
            alt="Profile"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ) : (<></>)}

        <label htmlFor="profilePicture">Upload a new profile picture</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleDocumentChange}
        />
        <br />
      </>):(<></>)}
    </>
  );
}

export default InformationSection;
