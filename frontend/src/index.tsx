import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Steps from "./components/ui/Steps";
import { powerUnitSteps, stabilitySteps } from "./utils/steps";
import {
  PowerUnitEngine,
  PowerUnitPropeller,
  PowerUnitResults,
  Performance,
  Settings,
  Turn,
  Weight,
} from "./pages";
import { useWeightStore } from "./data/stores/useWeightConfiguration"

// const weightConfigsRoutes = useWeightStore((state) => state.weightConfigurations);

import StabilityLongitudalMoment from "./pages/stabillity/StabilityLongitudalMoment";
import StabilityRodForce from "./pages/stabillity/StabilityRodForce";
import StabillitySteer from "./pages/stabillity/StabillitySteer";
import StabillityCharts from "./pages/stabillity/StabillityCharts";
import { aerodynamicsSteps } from "./utils/steps/aerodynamicsSteps";
import { WingAerodynamics, WingGeometry,Fuselage } from "./pages/areodynamics";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="aerodynamics" element={<Steps steps={aerodynamicsSteps} />}>
            <Route path="wing-geometry" element ={<WingGeometry/>} />
            <Route path="wing-aerodynamics" element ={<WingAerodynamics/>} />
            <Route path="fuselage" element ={<Fuselage/>} />
          </Route>
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
