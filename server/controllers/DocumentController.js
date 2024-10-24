const User = require("../models/userSchema.js");
const Document = require("../models/documentSchema.js");
const {uploadFile, downloadFile} = require('../utils/aws-s3.js');

const baseUrl = "https://bfgp.s3.amazonaws.com"

const updateFile = async(req, res) => {
  // const { userId } = req.body;
  const userId = "6717d2d7cd4fb7e80481f370";
  const { type } = req.query;
  const {base64File} = req.body;
  const fileType = base64File.slice(0, 30).split(/[;/]/)[1]

  const base64Data = base64File.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const fileUrl = `${baseUrl}/${userId}/${type}.${fileType}`

  try {
    await uploadFile(`${userId}/${type}.${fileType}`, buffer); 
    let updated;


    // for profile
    if (type === "profilePicture") {
      updated = await User.findByIdAndUpdate(
        userId,
        { $set: { "userProfile.profilePicture": fileUrl} },
        { new: true }
      ).lean().exec();
    }
    //for driver license copy
    else if (type == "licenseCopy") {
      updated = await User.findByIdAndUpdate(
        userId,
        { $set: { "driverLicense.licenseCopy": fileUrl} },
        { new: true }
      ).lean().exec();
    }
    //for opt-related documents
    //change onboard status to pending
    //update document table
    else {

      const document = await Document.find({user: userId, documentType: type}).lean().exec();
      if (document.length!==0) {
        updated = await Document.findOneAndUpdate(
          { user: userId, documentType: type }, 
          {
            $set: {
              fileUrl: fileUrl, 
              uploadedAt: Date.now(),
            },
          },
          { new: true }
        ).lean().exec();
      } else {
        updated = await Document.create({
          user: userId,
          documentType: type,
          fileUrl: fileUrl, 
          status: "Pending",
          feedback: "", 
          uploadedAt: Date.now() 
        });
      }
    }
    return res.status(200).json({updated});
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}

const fetchFileUrls = async (req, res) => {
  // const { userId } = req.body;
  const userId = "6717d2d7cd4fb7e80481f370";
  const files = {
    profilePicture: "",
    licenseCopy: "",
    OPT_receipt: "",
    OPT_EAD: "",
    I_983: "",
    I_20: "",
  };

  try {
    const user = await User.findById(userId).lean().exec();
    if (user.userProfile?.profilePicture) {
      files["profilePicture"] = user.userProfile.profilePicture;
    }
    if (user.driverLicense?.licenseCopy) {
      files["licenseCopy"] = user.driverLicense.licenseCopy;
    }

    const optFiles = await Document.find({ user: userId }).lean().exec();
    optFiles.map((file) => {
      files[file.documentType] = file.fileUrl;
    })
    return res.status(200).json({files});
  } 
  catch (error ) {
    res.status(500).json({ message: `${error}` });
  }
}

module.exports = {
  updateFile,
  fetchFileUrls
};
