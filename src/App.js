import React, { useState, useEffect } from "react";
import { BrowserRouter, withRouter } from "react-router-dom";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import Navigation from "./components/Navbar";
import Routing from "./components/Routing";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Configure Amplify with AWS exports
Amplify.configure(awsconfig);

function App(props) {
  // State variables for authentication status
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    async function getAuthStatus() {
      try {
        await Auth.currentSession();
        setAuthenticated(true);
      } catch (e) {
        if (e !== "no current user") {
          console.error(e);
        }
      }
      setIsAuthenticating(false);
    }
    getAuthStatus();
  }, []);

  // Render the application once authentication status is determined
  return (
    !isAuthenticating && (
      <div className="App">
        <BrowserRouter>
          <Navigation authed={authenticated} />
          <div className="body-container">
            <Routing appProps={{ authenticated, setAuthenticated }} />
          </div>
        </BrowserRouter>
      </div>
    )
  );
}

export default withRouter(App);
