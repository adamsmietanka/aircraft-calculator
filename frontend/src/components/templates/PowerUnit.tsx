import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface Step {
  name: string;
  path: string;
  enabledPaths: string[];
  previous?: string;
  next?: string;
}

const PowerUnit = () => {
  const [selectedRoute, setSelectedRoute] = useState<Step>();
  const routes: Step[] = [
    {
      name: "Engine",
      path: "engine",
      enabledPaths: ["results", "propeller", "engine"],
      next: "propeller",
    },
    {
      name: "Propeller",
      path: "propeller",
      enabledPaths: ["results", "propeller"],
      previous: "engine",
      next: "results",
    },
    {
      name: "Results",
      path: "results",
      enabledPaths: ["results"],
      previous: "propeller",
    },
  ];
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    let pathEnd = location.pathname.split("/")[2];
    let route = routes.find((el) => el.path === pathEnd);
    setSelectedRoute(() => route);
  }, [location]);

  return (
    <>
      <div className="flex flex-col w-full">
        <ul className="steps">
          {routes.map((route) => (
            <li
              className={`step cursor-pointer ${
                route.enabledPaths.includes(location.pathname.split("/")[2])
                  ? "step-primary"
                  : ""
              }`}
              onClick={() => navigate(route.path)}
            >
              {route.name}
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
      <div className="flex mt-auto">
        {selectedRoute?.previous && (
          <button
            className="btn mr-auto"
            onClick={() => navigate(selectedRoute?.previous as string)}
          >
            Previous
          </button>
        )}
        {selectedRoute?.next && (
          <button
            className="btn ml-auto"
            onClick={() => navigate(selectedRoute?.next as string)}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default PowerUnit;
