import React, { useEffect } from "react";
import {
  useSteerStore,
  useSteerOutputStore,
} from "../../../data/stores/useSteer";
import InputNumber from "../../../components/atoms/InputNumber";
import OverwritableInputNumber from "../../../components/atoms/OverwritableInputNumber";
import calculateAcoefs from "../../../utils/steerCalculation/aCoefficients/aCoefficients";

const StabillitySteerCooficientsDataCollapse = () => {
  const steerReynoldsNumber = useSteerStore(
    (state) => state.steerReynoldsNumber
  );
  const steerMachNumber = useSteerStore((state) => state.steerMachNumber);
  const o25clineIncilnation = useSteerStore(
    (state) => state.o25clineIncilnation
  );
  const steerAspectRatio = useSteerStore((state) => state.steerAspectRatio);
  const steerZbieznosc = useSteerStore((state) => state.steerZbieznosc);
  const profile = useSteerStore((state) => state.profile);
  const steerOuterSpan = useSteerStore((state) => state.steerOuterSpan);
  const steerInnerSpan = useSteerStore((state) => state.steerInnerSpan);
  const stabillzerSpan = useSteerStore((state) => state.stabillzerSpan);
  const steerToStabillizerCordRatio = useSteerStore(
    (state) => state.steerToStabillizerCordRatio
  );

  const setSteerReynoldsNumber = useSteerStore(
    (state) => state.setSteerReynoldsNumber
  );
  const setSteerMachNumber = useSteerStore((state) => state.setSteerMachNumber);
  const setO25clineIncilnation = useSteerStore(
    (state) => state.setSteero25clineInclination
  );
  const setSteerAspectRatio = useSteerStore(
    (state) => state.setSteerAspectRatio
  );
  const setSteerZbieznosc = useSteerStore((state) => state.setsteerzbieznosc);
  const setProfile = useSteerStore((state) => state.setProfile);
  const setSteerOuterSpan = useSteerStore((state) => state.setSteerOuterSpan);
  const setSteerInnerSpan = useSteerStore((state) => state.setSteerInnerSpan);
  const setStabillzerSpan = useSteerStore((state) => state.setStabillzerSpan);

  const a1 = useSteerOutputStore((state) => state.a1);
  const a2 = useSteerOutputStore((state) => state.a2);
  const setA1 = useSteerOutputStore((state) => state.setA1);
  const setA2 = useSteerOutputStore((state) => state.setA2);

  const profiles = ["NACA0007", "NACA0009", "NACA0006", "NACA0012"];
  useEffect(() => {
    let aCoef = calculateAcoefs(
      profile,
      steerReynoldsNumber,
      o25clineIncilnation,
      steerMachNumber,
      steerZbieznosc,
      steerAspectRatio,
      [steerOuterSpan, steerInnerSpan],
      stabillzerSpan,
      steerToStabillizerCordRatio
    );
    console.log(aCoef);
    setA1(aCoef.a1);
    setA2(aCoef.a2);
  }, [
    setA1,
    setA2,
    profile,
    steerReynoldsNumber,
    o25clineIncilnation,
    steerMachNumber,
    steerZbieznosc,
    steerAspectRatio,
    steerOuterSpan,
    steerInnerSpan,
    stabillzerSpan,
    steerToStabillizerCordRatio,
  ]);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title ">
        <div className="flex flex-col">
          <h2 className="text-xl font-medium pb-1">
            {" "}
            {"Lift force derivates"}
          </h2>
          <div className="flex flex-row justify-center font-normal">
            <h3 className="text-l pr-1">{"a1 ="}</h3>
            <h3 className="text-l">{a1.toPrecision(2)}</h3>
            <h3 className="text-l pl-1">1/rad</h3>
          </div>
          <div className="flex flex-row justify-center font-normal">
            <h3 className="text-l pr-1">{"a2 ="}</h3>
            <h3 className="text-l">{a2.toPrecision(2)}</h3>
            <h3 className="text-l pl-1">1/rad</h3>
          </div>
        </div>
      </button>
      <div className="collapse-content">
        <div className="flexbox flex-col mt-2 mb-2">
          <label className="label">
            <span className="label-text"> {"Choose stabilizer profile"}</span>
          </label>
          <select
            className="select select-bordered w-60 max-w-xs"
            onChange={(e) => {
              setProfile(e.target.value);
              console.log(profile);
            }}
          >
            {profiles.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <OverwritableInputNumber
          value={steerReynoldsNumber}
          setter={setSteerReynoldsNumber}
          label="Stabilizer reynolds number"
          unit="-"
          span={1000000}
        />

        <OverwritableInputNumber
          value={steerMachNumber}
          setter={setSteerMachNumber}
          label="Stabilizer Mach number"
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
          label="Stabilizer aspect ratio"
          unit="-"
          step={0.1}
        />

        <InputNumber
          value={steerZbieznosc}
          setter={setSteerZbieznosc}
          label="Stabilizer covergence"
          unit="-"
          step={0.1}
        />

        <InputNumber
          value={stabillzerSpan}
          setter={setStabillzerSpan}
          label="Stabilizer span"
          unit="m"
          step={1}
        />
        <InputNumber
          value={steerInnerSpan}
          setter={setSteerInnerSpan}
          label="Steer inner span"
          unit="m"
          step={0.1}
        />
        <InputNumber
          value={steerOuterSpan}
          setter={setSteerOuterSpan}
          label="Steer outer span"
          unit="m"
          step={0.1}
        />
      </div>
    </div>
  );
};

export default StabillitySteerCooficientsDataCollapse;
