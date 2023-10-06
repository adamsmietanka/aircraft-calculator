import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { a, useSpring } from "@react-spring/web";
import { ReactComponent as Arrow } from "../assets/arrow.svg";
import steps, { Step } from "./data/steps";
import { ReactComponent as Info } from "../../assets/info.svg";

const Tutorials = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();

  const feature = pathname.split("/")[1];

  const tutorialSteps = steps.filter(
    (s) => s.feature === feature && s.tutorial
  );
  const handleClick = (step: Step) => {
    (document.activeElement as HTMLElement).blur();
    navigate(`${step.feature}/${step.path}`, {
      state: { previousPath: pathname },
    });
  };

  return (
    <div className="dropdown dropdown-right dropdown-top">
      <div
        className="tooltip tooltip-hover tooltip-right z-50"
        data-tip="Tutorials"
      >
        <label tabIndex={0} className="btn btn-ghost text-color">
          <Info className="w-6" />
        </label>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li className="menu-title">Tutorials</li>
        {tutorialSteps.map((step) => (
          <li>
            <a
              className="flex justify-between"
              onClick={() => handleClick(step)}
            >
              <p>{step.symbol}</p>
              <p className="font-bold">{step.name}</p>
              <p>✓</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tutorials;
