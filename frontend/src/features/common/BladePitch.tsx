import { useEffect, useRef } from "react";
import { ReactComponent as ProfileIcon } from "../../assets/clarkY.svg";

interface Props {
  variable: boolean;
  setVariable: (value: boolean) => void;
}

const BladePitch = ({ variable, setVariable }: Props) => {
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = iconRef.current;
    if (element) {
      variable
        ? element.classList.add("variable")
        : element.classList.remove("variable");
    }
  }, [variable]);

  return (
    <div className="btn w-16 normal-case bg-base-300 join-item" onClick={() => setVariable(!variable)}>
      <div
        className="tooltip w-9 svg-color text-color z-50"
        data-tip={`Click to change to ${variable ? "fixed" : "variable"}`}
      >
        <ProfileIcon ref={iconRef} />
      </div>
    </div>
  );
};

export default BladePitch;
