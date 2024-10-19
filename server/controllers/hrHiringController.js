const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const Document = require("../models/documentSchema");
const Report = require("../models/reportSchema");

// Generate registration token
exports.generateRegToken = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ "userProfile.email": email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    // Generate a registration token (valid for 3 hours)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Set up the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Token",
      text: `Please use the following registration token: ${token}`,
    };

    // Send the email with the token
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to send email.",
          error,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Registration token generated and sent to the email.",
        token,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the registration token.",
    });
  }
};

// Get all onboarding application
exports.getOnboardingApplication = async (req, res) => {
  try {
    // Find all users and return only relevant fields (fullName, email, onboardStatus)
    const applications = await User.find(
      {},
      {
        "userProfile.firstName": 1,
        "userProfile.lastName": 1,
        "userProfile.email": 1,
        onboardStatus: 1,
      }
    );

    // Transform the data into the desired response format
    const formattedApplications = applications.map((user) => ({
      user: user._id,
      fullName: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
      email: user.userProfile.email,
      onboardStatus: user.onboardStatus,
    }));

    // Send the response back
    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching onboarding applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch onboarding applications.",
    });
  }
};

// Get individual application based on provided user id
exports.getIndividualApplication = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by the provided userId
    const user = await User.findById(userId).select(
      "userProfile.firstName userProfile.lastName userProfile.email onboardStatus"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find related documents for the user
    const documents = await Document.find({ user: user._id }).select(
      "documentType fileUrl feedback"
    );

    // Format the response
    const applicationDetails = {
      user: user._id,
      fullName: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
      email: user.userProfile.email,
      onboardStatus: user.onboardStatus,
      form: {
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        email: user.userProfile.email,
        documents: documents.map((doc) => ({
          title: doc.documentType,
          fileUrl: doc.fileUrl,
          documentFeedback: doc.feedback || "No feedback",
        })),
      },
      feedback: user.feedback || "No feedback available",
    };

    console.log(applicationDetails.documents);

    // Send the response
    res.status(200).json(applicationDetails);
  } catch (error) {
    console.error("Error fetching application:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch application", error });
  }
};

// Approve / Reject application
exports.updateApplicationStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, feedback } = req.body;

  try {
    // Validate the input
    const validStatuses = ["Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'Approved' or 'Rejected'.",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update the user's onboard status and feedback if necessary
    user.onboardStatus = status;
    if (status === "Rejected" && feedback) {
      user.feedback = feedback;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated.",
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status.",
      error,
    });
  }
};

// Give feedback - Having problem with Comment Schema
// exports.giveFeedback = async (req, res) => {
//   const { userId } = req.params;
//   const { feedback } = req.body;

//   try {
//     // Check if feedback is provided in the request body
//     if (!feedback || feedback.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Feedback is required.",
//       });
//     }

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Update the feedback for the user
//     user.feedback = feedback;

//     // Save the updated user
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Feedback submitted.",
//     });
//   } catch (error) {
//     console.error("Error updating feedback:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit feedback.",
//       error,
//     });
//   }
// };

// Get report, just for testing purposes
exports.getReport = async (req, res) => {
  try {
    const report = await Report.find();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching onboarding applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
    });
  }
};
