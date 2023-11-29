import { ReactComponent as CalculatorIcon } from "../../assets/calculator.svg";

interface Props {
  calculated: boolean;
  setCalculated: (value: boolean) => void;
}

const Calculator = ({ calculated, setCalculated }: Props) => {
  return (
    <div
      className="btn w-16 normal-case bg-base-300 join-item"
      onClick={() => setCalculated(!calculated)}
    >
      <div
        className="tooltip w-5 z-50"
        data-tip={`Click to change to ${calculated ? "manual" : "optimized"}`}
      >
        <CalculatorIcon
          className={`calculator ${calculated && "calculated"}`}
        />
      </div>
    </div>
  );
};

export default Calculator;
