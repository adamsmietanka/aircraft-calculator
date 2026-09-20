import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  PowerUnitEngine,
  PowerUnitPropeller,
  PowerUnitResults,
  Performance,
  Settings,
  Turn,
} from "./features";

import PlaneBuilder from "./features/navigation/PlaneBuilder";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<PlaneBuilder />} />
          <Route path="aerodynamics/*" element={<PlaneBuilder />} />
          <Route path="powerunit">
            <Route path="engine" element={<PowerUnitEngine />} />
            <Route path="propeller" element={<PowerUnitPropeller />} />
            <Route path="results" element={<PowerUnitResults />} />
          </Route>
          <Route path="performance" element={<Performance />} />
          <Route path="turn" element={<Turn />} />
          <Route path="navigation/*" element={<PlaneBuilder />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
