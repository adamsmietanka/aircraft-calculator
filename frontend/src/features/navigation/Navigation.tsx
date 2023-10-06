import { ReactComponent as Home } from "../../assets/home.svg";
import { ReactComponent as Airplane } from "../../assets/airplane.svg";
import { ReactComponent as Propeller } from "../../assets/propeller.svg";
import { ReactComponent as Engine } from "../../assets/engine.svg";
import { ReactComponent as Swing } from "../../assets/swing.svg";
import { ReactComponent as Scales } from "../../assets/scales.svg";
import { ReactComponent as Curve } from "../../assets/curve.svg";
import React from "react";
import { Settings } from "..";
import { NavLink, useLocation } from "react-router-dom";
import Tutorials from "./Tutorials";
import steps from "./data/steps";

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
    icon: <Scales />,
  },
  {
    to: "/stability",
    name: "Longitudinal Stability",
    icon: <Swing />,
  },
  {
    to: "/turn",
    name: "Turn Analysis",
    icon: <Curve />,
  },
];

const Navigation = () => {
  const { pathname } = useLocation();
  const feature = pathname.split("/")[1];
  const pathSubRoute = pathname.split("/")[2];
  const getStepIndex = (feature: string, subRoute?: string): number => {
    if (!feature) return 0;
    return steps.findIndex((r) =>
      subRoute
        ? r.path === subRoute && r.feature === feature
        : r.feature === feature
    );
  };
  const currentStepIndex = getStepIndex(feature, pathSubRoute);

  return (
    <div className="sticky flex flex-col justify-between h-screen top-0 p-2 z-50">
      <div
        className={`flex flex-col justify-between h-full ${
          (pathname === "/" || steps[currentStepIndex].tutorial) && "hidden"
        }`}
      >
        <div className="flex flex-col">
          {links.map((l) => (
            <NavLink to={l.to} state={{ previousPath: pathname }}>
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
        <div className="flex flex-col">
          <Tutorials />
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
