import React from "react";
import ReactDOM from "react-dom";
import { io } from "socket.io-client";
import App from "./App";
import "./index.css";
import { socketurl } from "./routes";

export const socket = io(socketurl, {
  transports: ["websocket"],
  withCredentials: true,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
