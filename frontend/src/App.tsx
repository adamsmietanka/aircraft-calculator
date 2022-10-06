import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ReactComponent as Home } from "./assets/home.svg";
import { ReactComponent as Airplane } from "./assets/airplane.svg";
import { ReactComponent as Propeller } from "./assets/propeller.svg";
import { ReactComponent as Engine } from "./assets/engine.svg";
import { ReactComponent as Scales } from "./assets/scales.svg";
import { ReactComponent as Cog } from "./assets/cog.svg";

function App() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <ul className="menu bg-base-100 p-2 rounded-box w-64">
        <li>
          <a>
            <Home className="w-6" />
            Home
          </a>
        </li>
        <li>
          <a>
            <Airplane className="w-6" />
            Aerodynamics
          </a>
        </li>
        <li>
          <a>
            <Propeller className="w-6" />
            Power Unit
          </a>
        </li>
        <li className="flex-1">
          <a>
            <Engine className="w-6" />
            Performance
          </a>
        </li>
        <li className="mt-auto">
          <a>
            <Scales className="w-6" />
            Weight distribution
          </a>
        </li>
      </ul>
      <ul className="menu bg-base-100 p-2 rounded-box w-64">
        <li>
          <a>
            <Cog className="w-6" />
            Settings
          </a>
        </li>
      </ul>
    </div>
  );
}

export default App;
