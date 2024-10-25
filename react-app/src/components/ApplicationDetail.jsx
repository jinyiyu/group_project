import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateApplicationStatus,
  giveFeedback,
  fetchIndividualApplication,
  fetchApplications,
} from "../store/applicationSlice/application.thunk";

const ApplicationDetails = ({ application, onBack }) => {
  const dispatch = useDispatch();
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  const handleStatusUpdate = (status) => {
    dispatch(
      updateApplicationStatus({
        userId: application.user,
        status,
        feedback: application.feedback,
      })
    ).then(() => {
      // Fetch the updated application details after status update
      dispatch(fetchIndividualApplication(application.user));
      dispatch(fetchApplications());
    });
  };

  const handleGiveFeedback = () => {
    console.log(application.user);
    if (feedbackInput.trim()) {
      dispatch(
        giveFeedback({ userId: application.user, description: feedbackInput })
      ).then(() => {
        // Fetch the updated application details after feedback is given
        dispatch(fetchIndividualApplication(application.user));
        dispatch(fetchApplications());
      });
      setFeedbackInput("");
      setFeedbackError("");
    } else {
      setFeedbackError("Feedback cannot be empty.");
    }
  };

  const isEmptyDocument = application.form.documents.length === 0;
  const isApprovedOrRejected =
    application.onboardStatus.toLowerCase() == "approved" ||
    application.onboardStatus.toLowerCase() === "rejected";

  return (
    <div>
      <h2>Onboarding Applications</h2>
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
      <div>
        <h3>Feedback</h3>
        {Array.isArray(application.feedback) ? (
          application.feedback.map((f, index) => <p key={index}>"{f}"</p>)
        ) : (
          <p>{application.feedback}</p>
        )}
        {application.onboardStatus.toLowerCase() === "pending" && (
          <div>
            <textarea
              placeholder="Enter feedback"
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
            />{" "}
            <br />
            {feedbackError && <p style={{ color: "red" }}>{feedbackError}</p>}
            <button onClick={handleGiveFeedback} id="feedback-button">
              Add Feedback
            </button>
          </div>
        )}
      </div>
      {/* Show Approve/Reject buttons only if status is "Pending" */}
      {application.onboardStatus.toLowerCase() === "pending" && (
        <div className="update-status-btn">
          <button onClick={() => handleStatusUpdate("approved")}>
            Approve
          </button>
          <button onClick={() => handleStatusUpdate("rejected")}>Reject</button>
          <button onClick={onBack}>Back</button>
        </div>
      )}
      {isApprovedOrRejected && (
        <div>
          <button onClick={onBack}>Back</button>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
