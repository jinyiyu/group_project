const {
  listFiles,
  listBuckets,
  createBucket,
  uploadFile,
  downloadFile,
  deleteFile,
} = require("./aws-s3");
const assert = require("assert");

async function testListFiles() {
  try {
    const files = await listFiles();
    assert(Array.isArray(files), "Expected listFiles to return an array");
    console.log("Test passed: listFiles returns an array");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

async function testListBuckets() {
  try {
    const buckets = await listBuckets();
    assert(Array.isArray(buckets), "Expected listBuckets to return an array");
    console.log("Test passed: listBuckets returns an array");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

async function testCreateBucket(bucketName) {
  try {
    await createBucket(bucketName);
    console.log("Test passed: createBucket executed successfully");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// uploadFile(
//   "documents/documentId/Group_Project.pdf",
//   "../../../Group_Project.pdf"
// );
//deleteFile("/testupload/groupproject.pdf");
downloadFile("documents/documentId/Group_Project.pdf", "downloadedFile.pdf");
testListFiles();
testListBuckets();
