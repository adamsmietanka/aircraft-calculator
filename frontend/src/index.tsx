import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/templates/Home';
import PowerUnit from './components/templates/PowerUnit';
import PowerUnitEngine from './components/organisms/PowerUnitEngine';
import PowerUnitPropeller from './components/organisms/PowerUnitPropeller';
import PowerUnitResults from './components/organisms/PowerUnitResults';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="powerunit" element={<PowerUnit />}>
          <Route path="engine" element={<PowerUnitEngine />} />
          <Route path="propeller" element={<PowerUnitPropeller />} />
          <Route path="results" element={<PowerUnitResults />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
