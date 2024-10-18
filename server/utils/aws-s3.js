const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Load AWS credentials from a JSON file
const credentialsPath = path.join(__dirname, "aws-credentials.json");
AWS.config.loadFromPath(credentialsPath);

const s3 = new AWS.S3();

const downloadFile = async (bucketName, key, downloadPath) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    fs.writeFileSync(downloadPath, data.Body);
    console.log(`File downloaded successfully to ${downloadPath}`);
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`);
  }
};

const uploadFile = async (bucketName, key, filePath) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  try {
    await s3.upload(params).promise();
    console.log(`File uploaded successfully to ${bucketName}/${key}`);
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
  }
};
const deleteFile = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    await s3.deleteObject(params).promise();
    console.log(`File deleted successfully from ${bucketName}/${key}`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};

const listFiles = async (bucketName) => {
  const params = {
    Bucket: bucketName,
  };
  console.log("params", params);
  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map((item) => item.Key);
    console.log(`Files in bucket ${bucketName}:`, files);
    return files;
  } catch (error) {
    console.error(`Error listing files: ${error.message}`);
  }
};

const listBuckets = async () => {
  try {
    const data = await s3.listBuckets().promise();
    const buckets = data.Buckets.map((bucket) => bucket.Name);
    console.log("Buckets:", buckets);
    return buckets;
  } catch (error) {
    console.error(`Error listing buckets: ${error.message}`);
  }
};

const createBucket = async (bucketName) => {
  const params = {
    Bucket: bucketName,
  };

  try {
    await s3.createBucket(params).promise();
    console.log(`Bucket ${bucketName} created successfully`);
  } catch (error) {
    console.error(`Error creating bucket: ${error.message}`);
  }
};

module.exports = {
  downloadFile,
  uploadFile,
  listFiles,
  listBuckets,
  createBucket,
  deleteFile,
};
