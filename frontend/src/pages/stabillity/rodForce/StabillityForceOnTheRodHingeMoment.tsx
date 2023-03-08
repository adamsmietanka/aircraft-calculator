import React from "react";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../../data/stores/useForceOnTheRod";
import InputNumber from "../../../components/atoms/InputNumber";

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
      <div className="collapse-title">
        <div className="flex flex-col">
          <h2 className="text-xl font-medium pb-1 justify-center">
            {" "}
            Derivative of the hinge moment and rod force calculation data
          </h2>
          <div className="flex flex-row justify-center font-normal">
            <h3 className="text-l pr-1">{"b1 ="}</h3>
            <h3 className="text-l">{b1.toPrecision(2)}</h3>
            <h3 className="text-l pl-1">1/rad</h3>
          </div>
          <div className="flex flex-row justify-center font-normal">
            <h3 className="text-l pr-1">{"b2 ="}</h3>
            <h3 className="text-l">{b2.toPrecision(2)}</h3>
            <h3 className="text-l pl-1">1/rad</h3>
          </div>
        </div>
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
