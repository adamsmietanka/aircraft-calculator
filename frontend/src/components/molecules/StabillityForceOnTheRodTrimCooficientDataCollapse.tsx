import React, { useEffect } from "react";
import { getB3 } from "../../utils/forceOnTheRodCalculation";
import { useForceOnTheRodOutputStore, useTrimStore } from "../../utils/useForceOnTheRod";
import InputNumber from "../atoms/InputNumber";

const StabillityForceOnTheRodTrimCooficientDataCollapse = () => {
  const trimData = useTrimStore();
  const b3 = useForceOnTheRodOutputStore((state) => state.b3)
  const setB3 = useForceOnTheRodOutputStore((state) => state.setB3)
  const deltaHK = useForceOnTheRodOutputStore((state) => state.deltaHk)

  useEffect(()=>{setB3(getB3(trimData))},[setB3,trimData])
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        {" "}
        Trim Hinge Moment Coofiecient and Angle
      </button>
      <div className="collapse-content ">
      <InputNumber
          value={trimData.rudderCord}
          setter={trimData.setRudderCord}
          label="Rudder cord in the center of the trim flap"
          unit="m"
          step={0.5}
        />
        <InputNumber
          value={trimData.steerSpan}
          setter={trimData.setSteerSpan}
          label="Steer span"
          unit="m"
          step={0.5}
        />

        <InputNumber
          value={trimData.steerAftHingeArea}
          setter={trimData.setAftHingeArea}
          label="The Area of the steer aft of the hinge"
          unit="m^2"
          step={0.5}
        />

        <InputNumber
          value={trimData.trimSpan}
          setter={trimData.setTrimSpan}
          label="The span of the trim flap"
          unit="m"
          step={0.5}
        />

        <InputNumber
          value={trimData.trimAftHingeArea}
          setter={trimData.setAftHingeArea}
          label="The area in the span of the trim flap located aft of the hinge"
          unit="m^2"
          step={1}
        />

        <InputNumber
          value={trimData.steerNoseHingeArea}
          setter={trimData.setSteerNoseHingeArea}
          label="The area in the span of the trim flap located between the hinge and nose"
          unit="m^2"
          step={0.5}
        />

        <InputNumber
          value={trimData.steerFwdHingeArea}
          setter={trimData.setSteerFwdHingeArea}
          label="The area in the span of the trim flap located between the hinge and nose"
          unit="m^2"
          step={0.5}
        />

        <InputNumber
          value={trimData.steerTrailingEdgeAngle}
          setter={trimData.setSteerTrailingEdgeAngle}
          label="Steer trailing edge angle"
          unit="deg"
          step={0.5}
        />
      </div>
    </div>
  );
};

export default StabillityForceOnTheRodTrimCooficientDataCollapse;
