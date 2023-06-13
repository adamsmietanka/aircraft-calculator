import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNavigationStore } from "../features/navigation/useNavigation";
import steps from "../features/navigation/data/steps";

const Steps = () => {
  let location = useLocation();
  let navigate = useNavigate();

  const feature = location.pathname.split("/")[1];
  const pathSubRoute = location.pathname.split("/")[2];
  const savedSubRoute = useNavigationStore((state) => state.routes[feature]);
  const saveSubRoute = useNavigationStore((state) => state.setRoute);

  const featureSteps = steps.filter((s) => s.feature === feature);

  useEffect(() => {
    saveSubRoute(feature, pathSubRoute);
    if (!pathSubRoute && savedSubRoute) {
      navigate(`${feature}/${savedSubRoute}`);
    }
  }, [savedSubRoute, feature, pathSubRoute, saveSubRoute, navigate]);

  const getStepIndex = (feature: string, subRoute: string): number =>
    steps.findIndex((r) => r.path === subRoute && r.feature === feature);

  const currentStepIndex = getStepIndex(feature, pathSubRoute);

  const previousRoute = steps[currentStepIndex - 1];
  const nextRoute = steps[currentStepIndex + 1];

  return (
    <>
      {featureSteps && featureSteps.length > 1 && (
        <ul className="sticky top-0 steps z-50 p-4 bg-base-100">
          {featureSteps.map((step) => (
            <li
              key={step.name}
              className={`step cursor-pointer ${
                getStepIndex(step.feature, step.path) <= currentStepIndex &&
                "step-primary"
              }`}
              onClick={() => {
                navigate(`${step.feature}/${step.path}`);
              }}
            >
              {step.name}
            </li>
          ))}
        </ul>
      )}
      <div className="h-full">
        <Outlet />
      </div>
      <div className="sticky bottom-0 p-4 z-50 h-20 bg-base-100">
        {previousRoute && (
          <button
            className="btn btn-error absolute left-4 bottom-4 normal-case"
            onClick={() =>
              navigate(`${previousRoute.feature}/${previousRoute.path}`)
            }
          >
            Previous: {previousRoute.name}
          </button>
        )}
        {/* <div className="join absolute bottom-4 left-96">
          <div className="dropdown dropdown-top dropdown-end">
            <label tabIndex={0} className="btn normal-case join-item">
              Choose Configuration
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Example Configuration</a>
              </li>
              <li>
                <a>Example Configuration 2</a>
              </li>
            </ul>
          </div>
          <button className="btn btn-outline normal-case join-item">Compare</button>
        </div> */}
        {nextRoute && (
          <button
            className="btn btn-info absolute right-4 bottom-4 normal-case"
            onClick={() => navigate(`${nextRoute.feature}/${nextRoute.path}`)}
          >
            Next: {nextRoute.name}
          </button>
        )}
      </div>
      <div className="fixed bottom-0 bg-base w-full"></div>
    </>
  );
};

export default Steps;
