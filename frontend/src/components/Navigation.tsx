import { ReactComponent as Home } from "../assets/home.svg";
import { ReactComponent as Airplane } from "../assets/airplane.svg";
import { ReactComponent as Propeller } from "../assets/propeller.svg";
import { ReactComponent as Engine } from "../assets/engine.svg";
import { ReactComponent as Scales } from "../assets/scales.svg";
import { ReactComponent as Curve } from "../assets/curve.svg";
import React from "react";
import Link from "./Link";
import { Settings } from "../features";

const links = [
  { to: "/", name: "Home", icon: <Home /> },
  {
    to: "/aerodynamics",
    name: "Aerodynamics",
    icon: <Airplane />,
  },
  {
    to: "/powerunit",
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
    to: "/stability",
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
    <div className="sticky flex flex-col justify-between h-screen top-0 w-96 p-2 bg-base">
      <div className="w-full">
        {links.map((l) => (
          <Link to={l.to}>
            {React.cloneElement(l.icon, { className: "w-6 mr-2" })}
            {l.name}
          </Link>
        ))}
      </div>
      <Settings />
    </div>
  );
};

export default Navigation;
