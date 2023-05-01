import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/templates/Home";
import Steps from "./components/templates/Steps";
import { powerUnitSteps , performanceUnitSteps} from "./utils/steps";
import {
  Aerodynamics,
  Settings,
  Turn,
  Weight,
} from "./components/organisms";
import { PowerUnitEngine, PowerUnitPropeller, PowerUnitResults } from "./features/power_unit";
import { PerformanceBreguet, PerformanceExtendedAlg, PerformanceInitial} from "./features/performance";


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
          <Route path="performance" element={<Steps steps={performanceUnitSteps} />}>
            <Route path="initial_data" element={<PerformanceInitial />} />
            <Route path="breguet" element={<PerformanceBreguet />} />
            <Route path="perf_extended" element={<PerformanceExtendedAlg />} />
          </Route>
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
