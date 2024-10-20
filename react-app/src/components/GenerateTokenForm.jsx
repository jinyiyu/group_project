import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../store/actions/auth.actions";
import { fetchApplications } from "../store/actions/application.actions";

const GenerateTokenForm = () => {
  const dispatch = useDispatch();

  const {
    notStarted = [],
    loading: appLoading,
    error: appError,
  } = useSelector((state) => state.application);

  const {
    loading: tokenLoading,
    success,
    error: tokenError,
  } = useSelector((state) => state.auth);

  const [showMessage, setShowMessage] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  useEffect(() => {
    if (success || tokenError) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, tokenError]);

  const handleGenerateToken = (email) => {
    setCurrentEmail(email);
    dispatch(generateToken(email));
  };

  return (
    <div>
      <h2>Generate Registration Token</h2>

      {/* Display any loading or error states related to fetching applications */}
      {appLoading && <p>Loading applications...</p>}
      {appError && <p style={{ color: "red" }}>{appError}</p>}

      {/* List of applications with "not started" status */}
      <ul>
        {notStarted.length > 0 ? (
          notStarted.map((app) => (
            <li key={app.email}>
              <span>{app.email}</span>
              <button
                onClick={() => handleGenerateToken(app.email)}
                disabled={tokenLoading}
              >
                {tokenLoading && currentEmail === app.email
                  ? "Generating..."
                  : "Generate Token"}
              </button>
            </li>
          ))
        ) : (
          <p>No applications with 'not started' status found.</p>
        )}
      </ul>

      {/* Display success or error messages based on the state, hidden after 3 seconds */}
      {showMessage && success && (
        <p>Registration token sent to {currentEmail}!</p>
      )}
      {showMessage && tokenError && (
        <p style={{ color: "red" }}>{tokenError}</p>
      )}
    </div>
  );
};

export default GenerateTokenForm;
