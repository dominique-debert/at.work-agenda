import React from "react";
import { render } from "react-dom";
import App from "./App"; //parent component

window.App = node => {
  render(<App />, node);
};
