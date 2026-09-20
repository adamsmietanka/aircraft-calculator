import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlaneBuilder from "./features/navigation/PlaneBuilder";
// Navigation renders <Settings /> as part of the always-mounted chrome, so
// splitting it here would only duplicate it into a chunk that always loads.
import Settings from "./features/settings/Settings";

// PlaneBuilder is the landing route and stays eager. The rest are split out:
// PowerUnitResults alone pulls in the ~580 kB verts.ts propeller surface mesh,
// which the 3D lessons never touch.
const PowerUnitEngine = lazy(
  () => import("./features/power_unit/PowerUnitEngine")
);
const PowerUnitPropeller = lazy(
  () => import("./features/power_unit/PowerUnitPropeller")
);
const PowerUnitResults = lazy(
  () => import("./features/power_unit/PowerUnitResults")
);
const Performance = lazy(() => import("./features/performance/Performance"));
const Turn = lazy(() => import("./features/turn/Turn"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
