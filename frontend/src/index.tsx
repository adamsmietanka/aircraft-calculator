import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/templates/Home";
import Steps from "./components/templates/Steps";
import { powerUnitSteps, stabilitySteps } from "./utils/steps";
import {
  PowerUnitEngine,
  PowerUnitPropeller,
  PowerUnitResults,
  Aerodynamics,
  Performance,
  Settings,
  Turn,
  Weight,
} from "./components/organisms";

import StabilityLongitudalMoment from "./components/organisms/StabilityLongitudalMoment";
import StabilityRodForce from "./components/organisms/StabilityRodForce";
import StabillitySteer from "./components/organisms/StabillitySteer";
import StabillityCharts from "./components/organisms/StabillityCharts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="aerodynamics" element={<Aerodynamics />} />
          <Route path="powerunit" element={<Steps steps={powerUnitSteps} />}>
            <Route path="engine" element={<PowerUnitEngine />} />
            <Route path="propeller" element={<PowerUnitPropeller />} />
            <Route path="results" element={<PowerUnitResults />} />
          </Route>
          <Route path="performance" element={<Performance />} />
          <Route path="weight" element={<Weight />} />
          <Route path="stability" element={<Steps steps={stabilitySteps} />}>
            <Route
              path="longitudal-moment"
              element={<StabilityLongitudalMoment />}
            />
            <Route path="steer" element={<StabillitySteer/>} />
            <Route path="rod-force" element={<StabilityRodForce />} />
            <Route
              path="stabillty-and-manouverabillty"
              element={<StabillityCharts/>}
            />
          </Route>
          <Route path="turn" element={<Turn />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
