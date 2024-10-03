import React, { useState } from "react";
import { Container, Button, FormGroup, Input, Label, Spinner } from "reactstrap";
import { Auth } from "aws-amplify";
import "./Login.css"; // Import the CSS file for styling

function LoginView(props) {
  // State variables for form inputs and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form fields configuration
  const forms = [
    { text: "Email", name: "email", type: "email", callback: setEmail },
    { text: "Password", name: "password", type: "password", callback: setPassword },
  ];

  // Function to handle user sign-in
  async function handleSignIn(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Attempt to sign in the user with AWS Amplify Auth
      await Auth.signIn(email, password);
      props.setAuthenticated(true); // Update authentication status
      props.history.push("/"); // Redirect to the home page
    } catch (e) {
      // Handle errors during sign-in
      setErrorMessage(e.message); // Set the error message to display
      setLoading(false); // Reset loading state
    }
  }

  // Check if form inputs are filled
  function isFormValid() {
    return email.trim().length > 0 && password.trim().length > 0;
  }

  // Render the Login component
  return (
    <Container className="login-container">
      <form className="login-form" onSubmit={handleSignIn}>
        {forms.map((field, index) => (
          <FormGroup key={index} className="login-form-group">
            <Label className="login-label">{field.text}</Label>
            <Input
              className="login-input"
              autoFocus={index === 0}
              name={field.name}
              type={field.type}
              onChange={(e) => field.callback(e.target.value)}
            />
          </FormGroup>
        ))}
        {/* Display error message if any */}
        {errorMessage && <div className="login-error">{errorMessage}</div>}
        {/* Login Button */}
        <Button
          block
          className="login-button"
          disabled={!isFormValid() || loading}
          type="submit"
        >
          {loading ? (
            <>
              <Spinner className="login-spinner" size="sm" color="light" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      {/* Link to the signup page */}
      <a href="signup" className="login-link">
        New user? Sign up here!
      </a>
    </Container>
  );
}

export default LoginView;
