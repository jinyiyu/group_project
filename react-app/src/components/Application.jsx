import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchApplications,
//   fetchIndividualApplication,
// } from "../store/actions/application.actions";
import {
  fetchApplications,
  fetchIndividualApplication,
} from "../store/applicationSlice/application.thunk";
import {
  selectPendingApplications,
  selectApprovedApplications,
  selectRejectedApplications,
  selectLoading,
  selectApplicationError,
  selectIndividualApplication,
} from "../store/applicationSlice/application.selectors";
import ApplicationDetails from "./ApplicationDetail";

const ApplicationReview = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const dispatch = useDispatch();

  // const { loading, pending, approved, rejected, error, application } =
  //   useSelector((state) => state.application);

  const pending = useSelector(selectPendingApplications);
  const approved = useSelector(selectApprovedApplications);
  const rejected = useSelector(selectRejectedApplications);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectApplicationError);
  const application = useSelector(selectIndividualApplication);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleViewApplication = (userId) => {
    dispatch(fetchIndividualApplication(userId));
    setSelectedApplication(userId);
  };

  const handleBackToReview = () => {
    setSelectedApplication(null);
  };

  const renderApplications = (applications) => {
    return applications.map((app, index) => (
      <div key={index} className="application-item">
        <span>
          {app.fullName} - {app.email}
        </span>
        <button onClick={() => handleViewApplication(app.user)}>
          View Application
        </button>
      </div>
    ));
  };

  if (selectedApplication && application) {
    return (
      <ApplicationDetails
        application={application}
        onBack={handleBackToReview}
      />
    );
  }

  return (
    <div>
      <h2>Onboarding Applications</h2>
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={activeTab === "rejected" ? "active" : ""}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
      </div>

      <div className="application-list">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {activeTab === "pending" && renderApplications(pending)}
        {activeTab === "rejected" && renderApplications(rejected)}
        {activeTab === "approved" && renderApplications(approved)}
      </div>
    </div>
  );
};

export default ApplicationReview;
