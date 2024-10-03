import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import "./Navbar.css";
import { CustomSignOut } from "./CustomSignOut";

const NavBar = (props) => {
  // Navigation links available when authenticated
  const navLinks = [
    { name: "Drop File", link: "/drop" },
    { name: "View Files", link: "/" },
  ];

  return (
    <div className="user-nav">
      <Navbar dark expand="md" variant="light">
        <NavbarBrand className="logo d-flex align-items-end" href="/">
          E-cloud
        </NavbarBrand>
        <Nav className="ml-auto the-nav" navbar>
          {props.authed &&
            navLinks.map((option, index) => (
              <NavItem key={index}>
                <NavLink href={option.link}>{option.name}</NavLink>
              </NavItem>
            ))}
          {props.authed && <CustomSignOut />}
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
