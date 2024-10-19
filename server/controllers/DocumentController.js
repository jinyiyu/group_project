const User = require("../models/userSchema.js");
const Document = require("../models/documentSchema.js");
const {uploadFile, downloadFile} = require('../utils/aws-s3.js');

const baseUrl = "https://bfgp.s3.amazonaws.com"

const updateFile = async(req, res) => {
  // const { userId } = req.body;
  const userId = "6711ed1baa0764012569e17d";
  const { type } = req.query;
  const file = req.files.file;

  try {
    // await uploadFile(`${userId}/${type}`, file.data); 
    let updated;

    // for profile
    if (type === "profilePicture") {
      updated = await User.findByIdAndUpdate(
        userId,
        { $set: { "userProfile.profilePicture": `${baseUrl}/${userId}/${type}` } },
        { new: true }
      ).lean().exec();
    }
    //for driver license copy
    else if (type == "carLicense") {
      // todo
    }
    //for opt-related documents
    else {
      updated = await Document.findOneAndUpdate(
        { user: userId, documentType: type },
        {
          $set: {
            fileUrl: `${baseUrl}/${userId}/${type}`,
            uploadedAt: Date.now(),
          },
        },
        { new: true, upsert: true }
      ).lean().exec();
    }
    return res.status(200).json({updated});
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}

const fetchFileUrls = async (req, res) => {
  // const { userId } = req.body;
  const userId = "6711ed1baa0764012569e17d";
  const files = {};

  try {
    const user = await User.findById(userId).lean().exec();
    if (user.userProfile.profilePicture) {
      files["profilePicture"] = user.userProfile.profilePicture;
    }
    // files["driverLicense"] = user.car.url; // TODO-ldl

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

// const fetchFileContent = async (req, res) => {
//   // const { userId } = req.body;
//   // const userId = "6711ed1baa0764012569e17d";
//   const { url, destinationPath } = req.body;
//   const parsedUrl = new URL(url);
//   const objectPath = parsedUrl.pathname.substring(1);

//   try {
//     const file = await downloadFile(objectPath, "TODO-ldl, user download path");
    
 
//   } catch (error) {
//     res.status(500).json({ message: `Error fetching file: ${error.message}` });
//   }
// };

module.exports = {
  updateFile,
  fetchFileUrls
};
