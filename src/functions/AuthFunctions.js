import { Auth } from "aws-amplify";
import { checkIfUserIsAdmin } from "./RDSFunctions";

// Function to get authenticated user's ID
export async function getAuthInfo() {
  return await (await Auth.currentUserCredentials()).identityId;
}

// Function to check if the user is an admin
export async function isAdmin() {
  try {
    let res = await checkIfUserIsAdmin(await getAuthInfo());
    return res;
  } catch (e) {
    if (e !== "No current user" && !e.includes("cannot get guest credentials")) {
      alert(e);
    }
    return false;
  }
}
