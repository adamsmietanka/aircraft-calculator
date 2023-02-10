import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Step } from "../../utils/steps";

interface StepsProps {
  steps: Step[];
}

const Steps = ({ steps }: StepsProps) => {
  const [selectedRoute, setSelectedRoute] = useState<Step>();
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    let pathEnd = location.pathname.split("/")[2];
    let route = steps.find((el) => el.path === pathEnd);
    setSelectedRoute(() => route);
  }, [location, steps]);

  return (
    <>
      <div className="flex flex-col w-full">
        <ul className="steps mb-4">
          {steps.map((route) => (
            <li
              key={route.name}
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
            onClick={() => navigate(selectedRoute.previous as string)}
          >
            Previous
          </button>
        )}
        {selectedRoute?.next && (
          <button
            className="btn ml-auto"
            onClick={() => navigate(selectedRoute.next as string)}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default Steps;
