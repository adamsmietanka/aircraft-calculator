import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/home/Home";
import Steps from "./components/Steps";
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
} from "./features";
import { useWeightStore } from "./data/stores/useWeightConfiguration";

// const weightConfigsRoutes = useWeightStore((state) => state.weightConfigurations);

import StabilityLongitudalMoment from "./features/stabillity/StabilityLongitudalMoment";
import StabilityRodForce from "./features/stabillity/StabilityRodForce";
import StabillitySteer from "./features/stabillity/StabillitySteer";
import StabillityCharts from "./features/stabillity/StabillityCharts";

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
              path="longitudinal-moment"
              element={<StabilityLongitudalMoment />}
            />
            <Route path="steer" element={<StabillitySteer />} />
            <Route path="rod-force" element={<StabilityRodForce />} />
            <Route
              path="stabillty-and-manouverabillty"
              element={<StabillityCharts />}
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
