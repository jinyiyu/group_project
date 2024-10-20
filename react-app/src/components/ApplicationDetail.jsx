import React from "react";
import { useDispatch } from "react-redux";
import { updateApplicationStatus } from "../store/actions/application.actions";

const ApplicationDetails = ({ application, onBack }) => {
  const dispatch = useDispatch();

  const handleStatusUpdate = (status) => {
    const feedback = status === "Rejected" ? prompt("Provide feedback:") : null;
    dispatch(updateApplicationStatus(application.user, status, feedback));
  };

  const isEmptyDocument = application.form.documents.length === 0;

  return (
    <div>
      <button onClick={onBack}>Back</button> {/* Back button */}
      <h2>Application Details for {application.fullName}</h2>
      <p>Email: {application.email}</p>
      <p>Status: {application.onboardStatus}</p>
      <h3>Documents</h3>
      <ul>
        {application.form?.documents?.map((doc) => (
          <li key={doc.title}>
            {doc.title}: <a href={doc.fileUrl}>View Document</a>
            <br />
            Feedback: {doc.documentFeedback}
          </li>
        ))}
        {isEmptyDocument && <p>No documents available</p>}
      </ul>
      {/* Show Approve/Reject buttons only if status is "Pending" */}
      {application.onboardStatus.toLowerCase() === "pending" && (
        <div>
          <button onClick={() => handleStatusUpdate("approved")}>
            Approve
          </button>
          <button onClick={() => handleStatusUpdate("rejected")}>Reject</button>
        </div>
      )}
      {/* Feedback section visible for Rejected applications */}
      {application.onboardStatus === "Rejected" && (
        <div>
          <h3>Feedback</h3>
          <p>{application.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
