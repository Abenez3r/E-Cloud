import React from "react";
import { Auth } from "aws-amplify";
import { NavItem, NavLink } from "reactstrap";

function CustomSignOut(props) {
  // Function to handle user sign-out
  const signOut = (e) => {
    e.preventDefault();
    Auth.signOut().then(() => window.location.reload(false));
  };

  return (
    <NavItem onClick={signOut}>
      <NavLink href="/login">Sign Out</NavLink>
    </NavItem>
  );
}

export { CustomSignOut };
