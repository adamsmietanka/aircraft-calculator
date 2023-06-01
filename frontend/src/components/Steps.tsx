import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Step } from "../utils/steps";

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
      <div className="flex flex-col w-full sticky top-0 z-50 py-2 bg-base">
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
      {selectedRoute?.next && (
        <button
          className="btn fixed right-4 bottom-4"
          onClick={() => navigate(selectedRoute.next as string)}
        >
          Next
        </button>
      )}
      {/* <div className="fixed bottom-0 bg-base w-full">
        {selectedRoute?.previous && (
          <button
            className="btn"
            onClick={() => navigate(selectedRoute.previous as string)}
          >
            Previous
          </button>
        )}
      </div> */}
    </>
  );
};

export default Steps;
