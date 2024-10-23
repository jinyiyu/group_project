const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const Document = require("../models/documentSchema");
// const  = require("../models/reportSchema");
const { Comment, Report } = require("../models/reportSchema");

// Updated generate registration token
exports.generateRegToken = async (req, res) => {
  const { email, fullName } = req.body;
  try {
    const existingUser = await User.findOne({ "userProfile.email": email });
    if (existingUser) {
      const { onboardStatus } = existingUser;
      if (
        ["pending", "approved", "rejected"].includes(
          onboardStatus.toLowerCase()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Cannot generate token. The user with status "${onboardStatus}" is not eligible.`,
        });
      }
    }

    // Generate a registration token (valid for 3 hours)
    const token = jwt.sign({ email, fullName }, process.env.JWT_SECRET, {
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
      text: `Hi ${fullName}, \n\nPlease use the following registration link to register for your application: http://localhost:5173/user/register/${token} \nThis link will only last for 3 hours, make sure to register during this time`,
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
      error,
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
    const user = await User.findById(userId)
      .select(
        "userProfile.firstName userProfile.lastName userProfile.email onboardStatus feedback"
      )
      .populate({
        path: "feedback",
        select: "desc createdBy timestamp",
        populate: {
          path: "createdBy",
          select: "userProfile.firstName userProfile.lastName",
        },
      });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const documents = await Document.find({ user: user._id }).select(
      "documentType fileUrl feedback"
    );

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
      // modified feedback
      feedback:
        user.feedback.length > 0 ? user.feedback : "No feedback available",
    };

    // Send the response
    res.status(200).json(applicationDetails);
  } catch (error) {
    console.error("Error fetching application:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch application", error });
  }
};

// Give feedback - Having problem with Comment Schema
exports.giveFeedback = async (req, res) => {
  const { userId } = req.params;
  const { description } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.feedback.push(description);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      feedback: description,
    });
  } catch (error) {
    console.error("Error giving feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to give feedback",
      error,
    });
  }
};

// Approve / Reject application
exports.updateApplicationStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, feedback } = req.body;

  try {
    // Validate the input
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
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

    // Update the user's onboard status and feedback
    user.onboardStatus = status.toLowerCase();

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

// Get all information of individual user - testing - Hieu Tran
// exports.getIndividual = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const user = await User.findById(userId);
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching application:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch application", error });
//   }
// };
