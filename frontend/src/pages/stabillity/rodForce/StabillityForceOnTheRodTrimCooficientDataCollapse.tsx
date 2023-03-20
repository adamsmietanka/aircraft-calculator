import React, { useEffect } from "react";
import {
  trimAngleCalculation,
} from "../../../utils/forceOnTheRodCalculation";

import { findClosestValueIndexIntheArray } from "../../../utils/misc";
import {
  calculateDelta,
  calculateSteerIncilinationAngle,
  getCzFromVelocity,
} from "../../../utils/steerCalculation/steerCalculation";
import {
  useForceOnTheRodOutputStore,
  useTrimStore,
  useTrimVelocityStore,
} from "../../../data/stores/useForceOnTheRod";
import {
  useLongitudalMomentOutput,
  useLongitudalMomentStore,
} from "../../../data/stores/useLongitudalMoment";
import {
  useSteerOutputStore,
  useSteerStore,
} from "../../../data/stores/useSteer";
import InputNumber from "../../../components/atoms/InputNumber";
import { getB3 } from "../../../utils/forceOnTheRodCalculation/b3";

const StabillityForceOnTheRodTrimCooficientDataCollapse = () => {
  const trimVelocity = useTrimVelocityStore((state) => state.trimVelocity);
  const setTrimVelocity = useTrimVelocityStore(
    (state) => state.setTrimVelocity
  );
  const trimData = useTrimStore();
  const b1 = useForceOnTheRodOutputStore((state) => state.b1);
  const b2 = useForceOnTheRodOutputStore((state) => state.b2);
  const b3 = useForceOnTheRodOutputStore((state) => state.b3);
  const setB3 = useForceOnTheRodOutputStore((state) => state.setB3);
  const deltaHK = useForceOnTheRodOutputStore((state) => state.deltaHk);
  const setDeltaHk = useForceOnTheRodOutputStore((state) => state.setDeltaHk);

  //delta and alfa calculation data
  const a = useSteerStore((state) => state.a);
  const a1 = useSteerOutputStore((state) => state.a1);
  const a2 = useSteerOutputStore((state) => state.a2);
  const kappa = useSteerOutputStore((state) => state.kappa);
  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const steerIncilinationAngle = useSteerOutputStore(
    (state) => state.steerInclinationAngle
  );
  const longitudanalMomentArray = useLongitudalMomentOutput(
    (state) => state.cmbu
  );
  const CzOriginalaArray = useLongitudalMomentStore((state) => state.cz);
  //Cz calculation data
  const cruiseAlttiude = useSteerStore((state) => state.cruiseAlttiude);
  const mass = useSteerStore((state) => state.mass);
  const wingSurface = useLongitudalMomentStore((state) => state.S);

  useEffect(() => {
    setB3(getB3(trimData));
  }, [setB3, trimData]);
  useEffect(() => {
    let cruiseVelocity = trimVelocity;
    let CzArray = [
      getCzFromVelocity({
        cruiseVelocity,
        cruiseAlttiude,
        mass,
        wingSurface,
      }),
    ];
    let Cz = CzArray.reduce((curr) => curr);

    let CmbuArray = [
      longitudanalMomentArray[
        findClosestValueIndexIntheArray(CzOriginalaArray, Cz)
      ],
    ];
    let Cmbu = CmbuArray.reduce((curr) => curr);

    let deltaH = calculateDelta({
      CmbuArray,
      CzArray,
      a,
      a1,
      a2,
      kappa,
      dEpsTodAlfa,
      steerIncilinationAngle,
    }).reduce((curr) => curr);

    let alfaH = calculateSteerIncilinationAngle({
      kappa,
      a1,
      a,
      dEpsTodAlfa,
      Cmbu,
      Cz,
    });

    setDeltaHk(trimAngleCalculation({ b1, b2, b3, alfaH, deltaH }));
  }, [a, a1, a2, kappa, dEpsTodAlfa, steerIncilinationAngle]);

  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title ">
        <h2 className="text-xl font-medium pb-1 justify-center">
          {" "}
          Derivative of the hinge moment for trim and trim inclination angle
        </h2>
        <div className="flex flex-row justify-center font-normal">
          <h3 className="text-l pr-1">{"b3 ="}</h3>
          <h3 className="text-l">{b3.toPrecision(2)}</h3>
          <h3 className="text-l pl-1">1/rad</h3>
        </div>
        <div className="flex flex-row justify-center font-normal">
          <h3 className="text-l pr-1">{"\u03B4_HK ="}</h3>
          <h3 className="text-l">{deltaHK.toPrecision(2)}</h3>
          <h3 className="text-l pl-1">rad</h3>
        </div>
      </button>

      <div className="collapse-content ">
        <InputNumber
          value={trimVelocity}
          setter={setTrimVelocity}
          label="Trim Velocity"
          unit="m/s"
        />
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
