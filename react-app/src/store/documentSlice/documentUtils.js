const BASE_URL = "http://localhost:3000";

const uploadDocument = async (documents, docName) => {
  const res = await fetch(`${BASE_URL}/document/upload?type=${docName}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64File: documents[docName],
    }),
  });
  if (!res.ok) {

    throw new Error(`Network response was not ok for updating document: ${docName}`);
  }
};

export {uploadDocument}