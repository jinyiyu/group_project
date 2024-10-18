const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListBucketsCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = "bfgp";

const downloadFile = async (key, downloadPath) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const body = await streamToBuffer(data.Body);
    fs.writeFileSync(downloadPath, body);
    console.log(`File downloaded successfully to ${downloadPath}`);
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`);
  }
};

const uploadFile = async (key, fileContent) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
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
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully from ${bucketName}/${key}`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};

const listFiles = async () => {
  const params = {
    Bucket: bucketName,
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    const files = data.Contents.map((item) => item.Key);
    console.log(`Files in bucket ${bucketName}:`, files);
    return files;
  } catch (error) {
    console.error(`Error listing files: ${error.message}`);
  }
};

const listBuckets = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand());
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
    await s3Client.send(new CreateBucketCommand(params));
    console.log(`Bucket ${bucketName} created successfully`);
  } catch (error) {
    console.error(`Error creating bucket: ${error.message}`);
  }
};

const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

module.exports = {
  downloadFile,
  uploadFile,
  listFiles,
  listBuckets,
  createBucket,
  deleteFile,
};
