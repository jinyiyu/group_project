import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenHistory } from "../store/actions/auth.actions";

const TokenHistory = () => {
  const dispatch = useDispatch();
  const { tokenHistory, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTokenHistory());
  }, [dispatch]);

  return (
    <div>
      <h2>Token History</h2>
      {loading && <p>Loading token history...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && tokenHistory.length === 0 && (
        <p>No token history found.</p>
      )}

      {!loading && tokenHistory.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Registration Link</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tokenHistory.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.email}</td>
                <td>{entry.name}</td>
                <td>
                  <a
                    href={entry.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TokenHistory;
