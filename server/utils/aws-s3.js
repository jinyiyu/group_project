const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

AWS.config.update(credentials);
AWS.config.loadFromPath(credentialsPath);

const s3 = new AWS.S3();
const bucketName = "bfgp";

const downloadFile = async (key, downloadPath) => {
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

const uploadFile = async (key, fileContent) => {
  // const fileContent = fs.readFileSync(filePath);

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
const deleteFile = async (key) => {
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

const listFiles = async () => {
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
