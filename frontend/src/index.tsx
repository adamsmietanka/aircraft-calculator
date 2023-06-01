import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/Home";
import Steps from "./components/Steps";
import { powerUnitSteps } from "./utils/steps";
import {
  PowerUnitEngine,
  PowerUnitPropeller,
  PowerUnitResults,
} from "./features/power_unit";
import Aerodynamics from "./features/aerodynamics/Aerodynamics";
import Weight from "./features/weight_distribution/Weight";
import Turn from "./features/turn/Turn";
import Settings from "./features/settings/Settings";
import Performance from "./features/performance/Performance";

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
