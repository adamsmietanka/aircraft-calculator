import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNavigationStore } from "./useNavigation";
import steps, { Step } from "./data/steps";
import { a, useSpring } from "@react-spring/web";
import Arrow from "../../assets/arrow.svg?react";

const Steps = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();

  const feature = pathname.split("/")[1];
  const pathSubRoute = pathname.split("/")[2];
  const savedSubRoute = useNavigationStore((state) => state.routes[feature]);
  const saveSubRoute = useNavigationStore((state) => state.setRoute);
  const tutorials = useNavigationStore((state) => state.tutorials);
  const setSeen = useNavigationStore((state) => state.setTutorialSeen);

  const featureSteps = steps.filter(
    (s) => s.feature === feature && !s.tutorial
  );

  const wasSeen = (step: Step) => !!tutorials[`/${step.feature}/${step.path}`];

  useEffect(() => {
    saveSubRoute(feature, pathSubRoute);
    if (!pathSubRoute && savedSubRoute) {
      navigate(`${feature}/${savedSubRoute}`, {
        state: { previousPath: pathname },
      });
    }
    if (steps[currentStepIndex].tutorial) setSeen(pathname);
  }, [feature, pathSubRoute, saveSubRoute, navigate]);

  const getStepIndex = (feature: string, subRoute?: string): number => {
    if (!feature) return 0;
    return steps.findIndex((r) =>
      subRoute
        ? r.path === subRoute && r.feature === feature
        : r.feature === feature
    );
  };

  const currentStepIndex = getStepIndex(feature, pathSubRoute);

  const getPreviousStep = (index: number): Step => {
    if (index - 1 < 0) return steps[0];
    if (wasSeen(steps[index - 1])) return getPreviousStep(index - 1);
    return steps[index - 1];
  };

  const getNextStep = (index: number): Step => {
    if (index + 1 > steps.length - 1) return steps[steps.length - 1];
    if (wasSeen(steps[index + 1])) return getNextStep(index + 1);
    return steps[index + 1];
  };

  const previousStep = getPreviousStep(currentStepIndex);
  const nextStep = getNextStep(currentStepIndex);

  const navigateTo = (step: Step) => {
    step.path
      ? navigate(`${step.feature}/${step.path}`, {
          state: { previousPath: pathname },
        })
      : navigate(`${step.feature}`, { state: { previousPath: pathname } });
  };

  const [props, propsApi] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: 2000,
      config: {
        tension: 280,
        friction: 120,
        precision: 0.0001,
      },
    }),
    []
  );
  const [skipProps, skipApi] = useSpring(
    () => ({
      from: { opacity: 0, display: "none" },
      config: {
        tension: 280,
        friction: 120,
        precision: 0.0001,
      },
    }),
    []
  );

  const isTutorial = steps[currentStepIndex].tutorial;

  useEffect(() => {
    skipApi.start({
      to: async (next) => {
        await next({ display: "none", opacity: 0, immediate: true });

        isTutorial &&
          (await next({ display: "inline-flex", opacity: 1, delay: 2500 }));
        isTutorial || (await next({ display: "none", opacity: 0 }));
      },
    });
  }, [isTutorial, pathname]);

  return (
    <>
      {featureSteps &&
        featureSteps.length > 1 &&
        !steps[currentStepIndex].tutorial && (
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
      <div className="sticky flex justify-between bottom-0 p-4 z-40 h-20">
        <a.button
          className={`btn normal-case ${
            (currentStepIndex === 0 || steps[currentStepIndex].tutorial) &&
            "invisible"
          }`}
          style={props}
          onClick={() => navigateTo(previousStep)}
        >
          <Arrow className="transform rotate-180" />
          {previousStep.name}
        </a.button>
        <a.button
          className={`btn ${
            (currentStepIndex === steps.length - 1 ||
              steps[currentStepIndex].tutorial) &&
            "invisible"
          } normal-case `}
          style={props}
          onClick={() => navigateTo(nextStep)}
        >
          {nextStep.name}
          <Arrow />
        </a.button>
        <a.button
          className="btn  normal-case"
          style={skipProps}
          onClick={() => navigateTo(nextStep)}
        >
          Skip
          <Arrow />
        </a.button>
      </div>
    </>
  );
};

export default Steps;
