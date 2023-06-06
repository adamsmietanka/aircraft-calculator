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
    <div
      className="btn w-16 normal-case bg-base-300 join-item"
      onClick={() => setCalculated(!calculated)}
    >
      <div
        className="tooltip w-5 svg-color text-color z-50"
        data-tip={`Click to change to ${calculated ? "manual" : "optimized"}`}
      >
        <CalculatorIcon ref={lockRef} />
      </div>
    </div>
  );
};

export default Calculator;
