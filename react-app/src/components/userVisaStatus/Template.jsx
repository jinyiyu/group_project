import { useDispatch, useSelector } from "react-redux";
import { fetchI983TemplateThunk } from "../../store/statusSlice/status.thunk";

const Template = () => {
  const dispatch = useDispatch();
  const handleDownload = (templateType) => {
    dispatch(fetchI983TemplateThunk(templateType));
  };
  return (
    <div>
      <ul>
        <li>
          <button onClick={() => handleDownload("empty")}>
            Download Empty Template
          </button>
        </li>
        <li>
          <button onClick={() => handleDownload("sample")}>
            Download Sample Template
          </button>
        </li>
      </ul>
    </div>
  );
};
export default Template;
