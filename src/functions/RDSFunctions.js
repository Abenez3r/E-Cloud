import { Config } from "../config/config.json";

// Function to add a new user to the RDS database
export async function addUserToRDS(newUser) {
  fetch(
    `${Config.DB_QUERY}/users/add?id=${newUser.userId}&firstName=${newUser.firstName}&lastName=${newUser.lastName}`
  ).catch((err) => {
    console.log(err);
  });
}

// Function to check if a user exists in the database
export async function checkIfUserExists(userId) {
  let exists = false;
  await fetch(`${Config.DB_QUERY}/users?id=${userId}`)
    .then((response) => response.json())
    .then((response) => {
      exists = response.exists;
    })
    .catch((err) => {
      console.log(err);
    });
  return exists;
}

// Function to check if a user is an admin
export async function checkIfUserIsAdmin(userId) {
  let isAdmin = false;
  await fetch(`${Config.DB_QUERY}/users?id=${userId}`)
    .then((response) => response.json())
    .then((response) => {
      isAdmin = response.isAdmin;
    })
    .catch((err) => {
      console.log(err);
    });
  return isAdmin;
}

// Function to add a file record to the database
export async function addFileToTable(fileData) {
  const { file_user_id, file_id, title, file_description, size } = fileData;
  fetch(
    `${Config.DB_QUERY}/files/add?userId=${file_user_id}&fileId=${file_id}&title=${title}&description=${file_description}&size=${size}`
  ).catch((err) => {
    console.log(err);
  });
}

// Function to retrieve files associated with a user
export async function getUserFiles(userId) {
  let objs = [];
  await fetch(`${Config.DB_QUERY}/files?id=${userId}`)
    .then((response) => response.json())
    .then((response) => {
      objs = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return objs;
}

// Function to delete a file record from the database
export async function deleteFile(userId, entryId) {
  let objs = [];
  await fetch(
    `${Config.DB_QUERY}/files/remove?id=${entryId}&userId=${userId}`
  )
    .then((response) => response.json())
    .then((response) => {
      objs = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return objs;
}

// Function to update a file record in the database
export async function updateFile(newFileData) {
  let objs = [];
  let { entryId, userId, title, fileName, size, description } = newFileData;
  if (!entryId) return objs;
  title = title ? title : "";
  fileName = fileName ? fileName : "";
  size = size ? size : "";
  description = description ? description : "";
  await fetch(
    `${Config.DB_QUERY}/files/update?entryId=${entryId}&userId=${userId}&fileId=${fileName}&title=${title}&description=${description}&size=${size}`
  )
    .then((response) => response.json())
    .then((response) => {
      objs = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return objs;
}
