import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Feedback = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <h1>{`Status: ${user.onboardStatus}`}</h1>

      {user.onboardStatus == "rejected" ? (
        <>
          <h1>Feedbacks: </h1>
          {user.feedback.map((f, index) => (
            <div key={index}>
              <p>{f}</p>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      {user.onboardStatus == "pending" ? (
        <>
          <h1>Please wait for HR to review your application</h1>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Feedback);
