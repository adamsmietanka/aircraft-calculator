import React, { useEffect, useRef } from "react";
import { ReactComponent as CalculatorIcon } from "../../assets/calculator.svg";

interface Props {
  calculated: boolean;
  setCalculated: (value: boolean) => void;
}

const Calculator = ({ calculated, setCalculated }: Props) => {
  const lockRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = lockRef.current;
    if (element) {
      calculated
        ? element.classList.add("calculated")
        : element.classList.remove("calculated");
    }
  }, [calculated]);

  return (
    <span className="cursor-pointer px-6" onClick={() => setCalculated(!calculated)}>
      <div
        className="tooltip w-5 svg-color text-color z-50"
        data-tip={`Click to change to ${calculated ? "manual" : "optimized"}`}
      >
        <CalculatorIcon ref={lockRef} />
      </div>
    </span>
  );
};

export default Calculator;
