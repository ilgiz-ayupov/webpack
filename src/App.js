import React from "react";
import "@styles/App.scss";
import ReactLogo from "@images/react-logo.png";

export default function App() {
  return (
    <div className="container">
      <h1 className="title">Hello React</h1>
      <img src={ReactLogo} />
    </div>
  );
}
