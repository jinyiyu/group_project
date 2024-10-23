import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const EmailForm = () => {
  // sendFrom: email, sendTo: email, content: text
  const [formData, setFormData] = useState({
    sendTo: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // onSubmit trigger this function to send email.
  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      to_email: formData.sendTo,
      message: formData.content,
    };

    // emailjs.send(serviceID, templateID, templateParams, options), option is optional.
    emailjs
      .send(
        "service_qajtlhi",
        "template_dfpkctt",
        templateParams,
        "SlwYI4G9g1yD3FUSt",
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          alert("Email sent successfully!");
        },
        (error) => {
          console.log("Failed to send email:", error.text);
          alert("Failed to send email.");
        },
      );
  };

  return (
    <form onSubmit={sendEmail}>
      <div>
        <label>To Email:</label>
        <input
          type="email"
          name="sendTo"
          value={formData.sendTo}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email Content:</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
