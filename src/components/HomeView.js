import React from "react";
import FileList from "./FileList";

function HomeView(appProps) {
  return appProps.authenticated && <FileList {...appProps} />;
}

export default HomeView;
