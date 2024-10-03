import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import HomeView from "./HomeView";
import UploadView from "./UploadView";
import Login from "./Login";
import SignUp from "./SignUp";
import { PrivateRoute } from "./PrivateRoute";

function Routing({ appProps }) {
  const signedOutRoutes = [
    { path: "/login", component: Login },
    { path: "/signup", component: SignUp },
  ];

  return (
    <Switch>
      {/* Private Routes */}
      <PrivateRoute
        exact
        path="/"
        appProps={{ allowed: appProps.authenticated, ...appProps }}
        component={HomeView}
      />
      <PrivateRoute
        path="/drop"
        appProps={{
          allowed: appProps.authenticated,
          redirect: "/login",
          ...appProps,
        }}
        component={UploadView}
      />
      {/* Public Routes */}
      {signedOutRoutes.map((route, index) => (
        <Route
          key={index}
          exact
          path={route.path}
          render={(props) =>
            !appProps.authenticated ? (
              <route.component {...appProps} {...props} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
      ))}
      {/* Default Redirect */}
      <Redirect to="/" />
    </Switch>
  );
}

export default Routing;
