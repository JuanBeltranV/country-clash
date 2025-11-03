import React from "react";
import ReactDOM from "react-dom/client";
import Game from "./Game.jsx";
import "./styles.css";

// Punto de entrada principal
// Renderizo el componente <Game /> dentro del div con id="root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
