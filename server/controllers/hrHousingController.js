const House = require("../models/houseSchema");
const { Report } = require("../models/reportSchema");
const User = require("../models/userSchema");
// const basicUser = require("../models/basicUserSchema");

// Get all existing houses
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find().select("address landlord numOfResidents");

    const formattedHouses = houses.map((house) => ({
      id: house._id,
      address: house.address,
      landlord: {
        name: house.landlord.name,
        phone: house.landlord.phone,
        email: house.landlord.email,
      },
      numOfResidents: house.numOfResidents,
    }));

    return res.status(200).json(formattedHouses);
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch houses.",
      error,
    });
  }
};

// Get house detail by house id
exports.getHouseDetail = async (req, res) => {
  const { houseId } = req.params;

  try {
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found.",
      });
    }

    const employees = await User.find({ house: houseId });

    // Find facility reports related to the house
    const facilityReports = await Report.find({
      createdBy: { $in: employees.map((emp) => emp._id) },
    })
      .populate("createdBy", "userName")
      .populate("comments.createdBy", "userName");

    const houseDetails = {
      id: house._id,
      address: house.address,
      landlord: {
        name: house.landlord.name,
        phone: house.landlord.phone,
        email: house.landlord.email,
      },
      numberOfResidents: house.numOfResidents,
      facilityInfo: {
        beds: house.facilityInfo.bed,
        mattresses: house.facilityInfo.mattresse,
        tables: house.facilityInfo.table,
        chairs: house.facilityInfo.chair,
      },
      facilityReports: facilityReports.map((report) => ({
        id: report._id,
        title: report.title,
        description: report.desc,
        createdBy: report.createdBy.userName,
        timestamp: report.timestamp,
        status: report.status,
        comments: report.comments.map((comment) => ({
          id: comment._id,
          createdBy: comment.createdBy.userName,
          commentUserId: comment.createdBy._id,
          description: comment.desc,
          timestamp: comment.timestamp,
        })),
      })),
      employees: employees.map((employee) => ({
        id: employee.id,
        fullName: `${employee.userProfile.firstName} ${employee.userProfile.lastName}`,
        phone: employee.contactInfo?.cellPhone || "N/A",
        email: employee.userProfile?.email || "N/A",
        car: employee.car || "N/A",
      })),
    };

    // Send the response
    return res.status(200).json(houseDetails);
  } catch (error) {
    console.error("Error fetching house details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch house details.",
      error,
    });
  }
};

// Create Comment for Facility Report
exports.addCommentToFacilityReport = async (req, res) => {
  const { reportId } = req.params;
  const { description, userId } = req.body;

  try {
    // Check if required fields are provided
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    // Find the report by reportId
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    report.comments.push({
      desc: description,
      createdBy: userId,
      timestamp: new Date(),
    });

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Comment added to the report.",
    });
  } catch (error) {
    console.error("Error adding comment to report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment to report.",
      error,
    });
  }
};

// Update Comment for Facility Report
exports.updateCommentToFacilityReport = async (req, res) => {
  const { reportId, commentId } = req.params;
  const { description, currentUserId } = req.body;

  try {
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Check if the current user is the one who created the comment
    if (comment.createdBy.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment.",
      });
    }

    // Update the comment's description
    comment.desc = description;
    comment.timestamp = new Date();

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
    });
  } catch (error) {
    console.error("Error updating comment in report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update comment in report.",
      error,
    });
  }
};

// Get all housing employees
exports.getEmployees = async (req, res) => {
  const { houseId } = req.params;

  try {
    const employees = await User.find({ house: houseId }).select(
      "userProfile.firstName userProfile.lastName contactInfo.cellPhone userProfile.email car"
    );

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found for this house.",
      });
    }

    const employeeInfo = employees.map((employee) => ({
      fullName: `${employee.userProfile.firstName} ${employee.userProfile.lastName}`,
      phone: employee.contactInfo.cellPhone,
      email: employee.userProfile.email,
      car: employee.car,
    }));

    // Send the response
    return res.status(200).json(employeeInfo);
  } catch (error) {
    console.error("Error fetching employee information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee information.",
      error,
    });
  }
};

// Add house
exports.addHouse = async (req, res) => {
  const { address, landlord, facilityInfo, numOfResidents } = req.body;

  console.log(address);

  try {
    if (!address || !landlord || !facilityInfo) {
      return res.status(400).json({
        success: false,
        message: "Address, landlord, and facility information are required.",
      });
    }

    const newHouse = new House({
      address: address,
      numOfResidents,
      landlord: {
        name: landlord.name,
        phone: landlord.phone,
        email: landlord.email,
      },
      facilityInfo: {
        bed: facilityInfo.beds,
        mattresse: facilityInfo.mattresse,
        table: facilityInfo.tables,
        chair: facilityInfo.chairs,
        addr: address,
      },
    });

    const savedHouse = await newHouse.save();

    return res.status(201).json({
      success: true,
      message: "New house added successfully.",
      houseId: savedHouse._id,
    });
  } catch (error) {
    console.error("Error adding new house:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add new house.",
      error,
    });
  }
};

// Delete house
exports.deleteHouse = async (req, res) => {
  const { houseId } = req.params;

  try {
    const house = await House.findByIdAndDelete(houseId);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "House deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting house:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete house.",
      error,
    });
  }
};

// Get report, just for testing purposes
exports.getReport = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching onboarding applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
      error,
    });
  }
};
