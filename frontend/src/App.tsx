import "./App.css";
import { ReactComponent as Home } from "./assets/home.svg";
import { ReactComponent as Airplane } from "./assets/airplane.svg";
import { ReactComponent as Propeller } from "./assets/propeller.svg";
import { ReactComponent as Engine } from "./assets/engine.svg";
import { ReactComponent as Scales } from "./assets/scales.svg";
import { ReactComponent as Curve } from "./assets/curve.svg";
import { ReactComponent as Cog } from "./assets/cog.svg";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between h-screen w-64">
        <ul className="menu bg-base-100 p-2 rounded-box">
          <li>
            <Link to="/">
              <Home className="w-6" />
              Home
            </Link>
          </li>
          <li>
            <a>
              <Airplane className="w-6" />
              Aerodynamics
            </a>
          </li>
          <li>
            <Link to="/powerunit">
              <Propeller className="w-6" />
              Power Unit
            </Link>
          </li>
          <li>
            <a>
              <Engine className="w-6" />
              Performance
            </a>
          </li>
          <li>
            <a>
              <Scales className="w-6" />
              Weight distribution
            </a>
          </li>
          <li>
            <a>
              <Curve className="w-6" />
              Turn analysis
            </a>
          </li>
        </ul>
        <ul className="menu bg-base-100 p-2 rounded-box">
          <li>
            <a>
              <Cog className="w-6" />
              Settings
            </a>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
