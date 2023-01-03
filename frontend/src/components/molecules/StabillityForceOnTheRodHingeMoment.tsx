import React from "react";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../utils/useForceOnTheRod";
import InputNumber from "../atoms/InputNumber";

const StabillityForceOnTheRodHingeMoment = () => {
  const b1 = useForceOnTheRodOutputStore((state) => state.b1);
  const b2 = useForceOnTheRodOutputStore((state) => state.b2);
  const height = useForceOnTheRodStore((state) => state.height);
  const setHeight = useForceOnTheRodStore((state) => state.setHeight);
  const steerCord = useForceOnTheRodStore((state) => state.steerCord);
  const setSteerCord = useForceOnTheRodStore((state) => state.setSteerCord);
  const rodLenght = useForceOnTheRodStore((state) => state.rodLenght);
  const setRodLenght = useForceOnTheRodStore((state) => state.setRodLenght);
  const angularRudderToSteeringGearRatio = useForceOnTheRodStore(
    (state) => state.angularRudderToSteeringGearRatio
  );
  const setAngularRudderToSteeringGearRatio = useForceOnTheRodStore(
    (state) => state.setAngularRudderToSteeringGearRatio
  );

  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Coefficient of the derivative of the hinge moment and rod data
        <label className="label">
          <span className="label-text"> b1 = {b1} </span>
        </label>
        <label className="label">
          <span className="label-text"> b2 = {b2} </span>
        </label>
      </div>
      <div className="collapse-content ">


        <InputNumber
          value={height}
          setter={setHeight}
          label="Height"
          unit="m"
          step={100}
        />

        <InputNumber
          value={steerCord}
          setter={setSteerCord}
          label="Steer Cord"
          unit="m"
          step={1}
        />

        <InputNumber
          value={angularRudderToSteeringGearRatio}
          setter={setAngularRudderToSteeringGearRatio}
          label="Angular Rudder Gear Ratio"
          unit="rad"
          step={0.1}
        />

        <InputNumber
          value={rodLenght}
          setter={setRodLenght}
          label="The length of the rod"
          unit="m"
          step={0.1}
        />
      </div>
    </div>
  );
};

export default StabillityForceOnTheRodHingeMoment;
