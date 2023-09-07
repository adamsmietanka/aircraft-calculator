import { ReactComponent as Home } from "../assets/home.svg";
import { ReactComponent as Airplane } from "../assets/airplane.svg";
import { ReactComponent as Propeller } from "../assets/propeller.svg";
import { ReactComponent as Engine } from "../assets/engine.svg";
import { ReactComponent as Scales } from "../assets/scales.svg";
import { ReactComponent as Curve } from "../assets/curve.svg";
import React from "react";
import { Settings } from "../features";
import { NavLink, useLocation } from "react-router-dom";

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
  const location = useLocation();
  return (
    <div className="sticky flex flex-col justify-between h-screen top-0 p-2 z-50">
      {location.pathname === "/" || (
        <>
          <div className="flex flex-col">
            {links.map((l) => (
              <NavLink to={l.to}>
                {({ isActive }) => (
                  <div
                    className="tooltip tooltip-hover tooltip-right z-50"
                    data-tip={l.name}
                  >
                    <button
                      className={`btn btn-block btn-ghost justify-start ${
                        isActive && "bg-base-300"
                      }`}
                    >
                      {React.cloneElement(l.icon, { className: "w-6" })}
                    </button>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
          <Settings />
        </>
      )}
    </div>
  );
};

export default Navigation;
