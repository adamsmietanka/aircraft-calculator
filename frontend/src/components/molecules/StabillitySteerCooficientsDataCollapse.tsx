import React, { useEffect } from "react";
import { useSteerStore, useSteerOutputStore } from "../../utils/useSteer";
import DropdownSelect from "../atoms/DropdownSelect";
import InputNumber from "../atoms/InputNumber";
import OverwritableInputNumber from "../atoms/OverwritableInputNumber";

const StabillitySteerCooficientsDataCollapse = () => {
  const steerReynoldsNumber = useSteerStore(
    (state) => state.steerReynoldsNumber
  );
  const steerMachNumber = useSteerStore(
    (state) => state.steerMachNumber
  );
  const o25clineIncilnation = useSteerStore(
    (state) => state.o25clineIncilnation
  );
  const steerAspectRatio = useSteerStore((state) => state.steerAspectRatio);
  const steerZbieznosc = useSteerStore((state) => state.steerZbieznosc);

  const setSteerReynoldsNumber = useSteerStore(
    (state) => state.setSteerReynoldsNumber
  );
  const setSteerMachNumber = useSteerStore(
    (state) => state.setSteerMachNumber
  );
  const setO25clineIncilnation = useSteerStore(
    (state) => state.setSteero25clineInclination
  );
  const setSteerAspectRatio = useSteerStore(
    (state) => state.setSteerAspectRatio
  );
  const setSteerZbieznosc = useSteerStore((state) => state.setsteerzbieznosc);

  const a1 = useSteerOutputStore((state) => state.a1);
  const a2 = useSteerOutputStore((state) => state.a2);
  const setA1 = useSteerOutputStore((state) => state.setA1);
  const setA2 = useSteerOutputStore((state) => state.setA2);

  const profiles = [
    { name: "NACA 0009", value: 1 },
    { name: "NACA 0007", value: 2 },
  ];
  useEffect(() => {
    setA1(2);
    setA2(2.14);
  }, []);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        {" "}
        The a cooficients: a1 = {a1.toPrecision(2)}, a2 = {a2.toPrecision(2)}
      </button>
      <div className="collapse-content">
        <DropdownSelect //to change
          label="Choose stabilaizer profile"
          options={profiles}
          setter={setA1} //to change
        />
        <OverwritableInputNumber
          value={steerReynoldsNumber}
          setter={setSteerReynoldsNumber}
          label="Steer reynolds number"
          unit="-"
          span={100000}
        />

        <OverwritableInputNumber
          value={steerMachNumber}
          setter={setSteerMachNumber}
          label="Steer Mach number"
          unit="-"
          span={0.1}
        />

        <InputNumber
          value={o25clineIncilnation}
          setter={setO25clineIncilnation}
          label="The 0.25c line inclination"
          unit="deg"
          step={1}
        />

        <InputNumber
          value={steerAspectRatio}
          setter={setSteerAspectRatio}
          label="The aspect reatio of the rudder"
          unit="-"
          step={0.1}
        />

        <InputNumber
          value={steerZbieznosc}
          setter={setSteerZbieznosc}
          label="Zbieżność stetcznika, nie pamiętam jak po angielsku kurka wodna"
          unit="-"
          step={100000}
        />
      </div>
    </div>
  );
};

export default StabillitySteerCooficientsDataCollapse;
