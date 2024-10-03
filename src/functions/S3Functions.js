import { Storage } from "aws-amplify";

// Function to update an object in S3
export async function updateObject(newFile, oldKey) {
  await deleteObject(oldKey);
  return await uploadObject(newFile);
}

// Function to delete an object from S3
export async function deleteObject(key) {
  await Storage.remove(key);
}

// Function to upload an object to S3
export async function uploadObject(file) {
  const filename = `${Date.now()}-${file.name}`;
  return await Storage.put(filename, file, {
    contentType: file.type,
  });
}

// Function to list objects in S3
export async function getObjects() {
  return await Storage.list("");
}

// Function to get a download URL for an object in S3
export async function getDownloadUrl(key) {
  return await Storage.get(key);
}
