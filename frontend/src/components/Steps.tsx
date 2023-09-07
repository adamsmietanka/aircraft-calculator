import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNavigationStore } from "../features/navigation/useNavigation";
import steps, { Step } from "../features/navigation/data/steps";

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

  const getStepIndex = (feature: string, subRoute?: string): number => {
    if (!feature) return 0;
    return steps.findIndex((r) => r.path === subRoute && r.feature === feature);
  };

  const currentStepIndex = getStepIndex(feature, pathSubRoute);

  const previousStep = steps[currentStepIndex - 1];
  const nextStep = steps[currentStepIndex + 1];

  const navigateTo = (step: Step) => {
    step.path ? navigate(`${step.feature}/${step.path}`) : navigate(`/`);
  };

  return (
    <>
      {featureSteps && featureSteps.length > 1 && (
        <ul className="sticky top-0 steps z-40 p-4">
          {featureSteps.map((step) => (
            <li
              key={step.name}
              className={`step cursor-pointer ${
                getStepIndex(step.feature, step.path) <= currentStepIndex &&
                "step-primary"
              }`}
              onClick={() => navigateTo(step)}
            >
              {step.name}
            </li>
          ))}
        </ul>
      )}
      <div className="h-full">
        <Outlet />
      </div>
      <div className="sticky bottom-0 p-4 z-50 h-20">
        {previousStep && (
          <button
            className="btn btn-error absolute left-4 bottom-4 normal-case"
            onClick={() => navigateTo(previousStep)}
          >
            Previous: {previousStep.name}
          </button>
        )}
        {nextStep && (
          <button
            className="btn btn-info absolute right-4 bottom-4 normal-case"
            onClick={() => navigateTo(nextStep)}
          >
            Next: {nextStep.name}
          </button>
        )}
      </div>
      <div className="fixed bottom-0 bg-base w-full"></div>
    </>
  );
};

export default Steps;
