import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../store/userSlice/userThunks";
import { fetchDocumentThunk } from "../store/documentSlice/documentThunk";
import UserForm from "../components/UserForm";
import DocumentGallery from "../components/DocumentGallery";
import Feedback from "../components/Feedback";

function OnBoarding() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserThunk());
    dispatch(fetchDocumentThunk());
  }, []);

  return (
    <>
      <Feedback></Feedback>
      <UserForm></UserForm>
      <DocumentGallery></DocumentGallery>
    </>
  );
}

export default OnBoarding;
