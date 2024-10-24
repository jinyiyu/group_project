import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../store/hrAuthSlice/auth.thunk";
import {
  selectLoading,
  selectSuccess,
  selectError,
} from "../store/hrAuthSlice/auth.selectors";

import TokenHistory from "./TokenHistory";

const GenerateTokenForm = () => {
  const dispatch = useDispatch();

  // const {
  //   loading: tokenLoading,
  //   success,
  //   error: tokenError,
  // } = useSelector((state) => state.auth);

  const tokenLoading = useSelector(selectLoading);
  const success = useSelector(selectSuccess);
  const tokenError = useSelector(selectError);

  const [showMessage, setShowMessage] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (success || tokenError) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, tokenError]);

  const handleGenerateToken = (e) => {
    e.preventDefault();
    dispatch(generateToken({ email, fullName }));
  };

  return (
    <div>
      <h2>Generate Registration Token</h2>
      <form onSubmit={handleGenerateToken}>
        <div>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>{" "}
        <br />
        <button type="submit" disabled={tokenLoading}>
          {tokenLoading ? "Generating..." : "Generate Token"}
        </button>
      </form>
      {/* Display success or error messages based on the state, hidden after 3 seconds */}
      {showMessage && success && <p>Registration token sent to {email}!</p>}
      {showMessage && tokenError && (
        <p style={{ color: "red" }}>{tokenError}</p>
      )}
      <TokenHistory />
    </div>
  );
};

export default GenerateTokenForm;
