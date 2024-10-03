import React, { useState } from "react";
import { Container, Label, Button, FormGroup, Input, Spinner } from "reactstrap";
import { getAuthInfo } from "../functions/AuthFunctions";
import { addUserToRDS } from "../functions/RDSFunctions";
import { Auth } from "aws-amplify";

function Signup(props) {
  // State variables for form inputs and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form fields configuration
  const forms = [
    { text: "Email", type: "email", callback: setEmail },
    { text: "First Name", type: "text", callback: setFirstName },
    { text: "Last Name", type: "text", callback: setLastName },
    { text: "Password", type: "password", callback: setPassword },
    { text: "Confirm Password", type: "password", callback: setPasswordConfirm },
  ];

  // Validate the signup form
  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      password === passwordConfirm
    );
  }

  // Validate the confirmation form
  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  // Handle user signup
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password,
      });
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  }

  // Handle confirmation code submission
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      props.setAuthenticated(true);
      const userId = await getAuthInfo();
      await addUserToRDS({ userId, firstName, lastName });
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  }

  // Render the confirmation form
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup>
          <Label>Confirmation Code</Label>
          <Input
            autoFocus
            type="tel"
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter 6-digit code here..."
          />
          <Label>Please check your email for the code.</Label>
        </FormGroup>
        <Button
          block
          disabled={!validateConfirmationForm()}
          type="submit"
          style={{ backgroundColor: "#c0d6df" }}
        >
          {loading ? <Spinner color="primary" /> : "Verify"}
        </Button>
      </form>
    );
  }

  // Render the signup form
  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        {forms.map((field, index) => (
          <FormGroup key={index}>
            <Label>{field.text}</Label>
            <Input
              autoFocus={index === 0}
              type={field.type}
              onChange={(e) => field.callback(e.target.value)}
            />
          </FormGroup>
        ))}
        <Button
          block
          disabled={!validateForm()}
          type="submit"
          style={{ backgroundColor: "#c0d6df" }}
        >
          {loading ? <Spinner color="primary" /> : "Sign Up"}
        </Button>
      </form>
    );
  }

  return (
    <Container>
      {newUser === null ? renderForm() : renderConfirmationForm()}
      <br />
      <a href="login">I already have an account</a>
    </Container>
  );
}

export default Signup;
