import { ReactComponent as Home } from "../assets/home.svg";
import { ReactComponent as Airplane } from "../assets/airplane.svg";
import { ReactComponent as Propeller } from "../assets/propeller.svg";
import { ReactComponent as Engine } from "../assets/engine.svg";
import { ReactComponent as Scales } from "../assets/scales.svg";
import { ReactComponent as Curve } from "../assets/curve.svg";
import { ReactComponent as Cog } from "../assets/cog.svg";
import React from "react";
import Link from "./Link";

const links = [
  { to: "/", name: "Home", icon: <Home /> },
  {
    to: "/aerodynamics",
    name: "Aerodynamics",
    icon: <Airplane />,
  },
  {
    to: "/powerunit/engine",
    name: "Power Unit",
    icon: <Propeller />,
  },
  {
    to: "/performance",
    name: "Performance",
    icon: <Engine />,
  },
  {
    to: "/weight",
    name: "Mass Distribution",
    icon: <img src="https://img.icons8.com/ios/100/null/weight-kg.png" />,
  },
  {
    to: "/stability/longitudinal-moment",
    name: "Longitudinal Stability",
    icon: <Scales />,
  },
  {
    to: "/turn",
    name: "Turn Analysis",
    icon: <Curve />,
  },
];
const Navigation = () => {
  return (
    <div className="flex flex-col justify-between h-screen w-80 p-2">
      <div>
        {links.map((l) => (
          <Link to={l.to}>
            {React.cloneElement(l.icon, { className: "w-6 mr-2" })}
            {l.name}
          </Link>
        ))}
      </div>
      <Link to="/settings">
        <Cog className="w-6 mr-2" />
        Settings
      </Link>
    </div>
  );
};

export default Navigation;
