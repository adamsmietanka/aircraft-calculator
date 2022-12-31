import React, { useEffect } from "react";
import { longitudalMoment } from "../../utils/longitudalMomentCalculator";
import {
  calculateSteerIncilinationAngle,
  getCzFromVelocity,
} from "../../utils/steerCalculation";
import {
  useLongitudalMomentStore,
  useLongitudalMomentOutput,
} from "../../utils/useLongitudalMoment";
import { useSteerOutputStore, useSteerStore } from "../../utils/useSteer";
import OverwritableInputNumber from "../atoms/OverwritableInputNumber";

function closest(value: number, array: number[]) {
  var result: number[] = [];
  array.some(function (a) {
    if (a > value) {
      return result.push(a);
    }
    result = [a];
    return a === value;
  });
  return result;
}

const StabillitySteerAngleOfIncilination = () => {
  const cruiseVelocity = useSteerStore((state) => state.cruiseVelocity);
  const cruiseAlttiude = useSteerStore((state) => state.cruiseAlttiude);
  const mass = useSteerStore((state) => state.mass);
  const wingSurface = useLongitudalMomentStore((state) => state.S);

  // const data = useLongitudalMomentStore();

  const a = useSteerStore((state) => state.a);
  const kappa = useSteerOutputStore((state) => state.kappa);
  const a1 = useSteerOutputStore((state) => state.a1);
  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const cmbuArray = useLongitudalMomentOutput((state) => state.cmbu);
  const Cz_array = useLongitudalMomentStore((state) => state.cz);

  const setCruiseVelocity = useSteerStore((state) => state.setCruiseVelocity);
  const setCruiseAlttiude = useSteerStore((state) => state.setCruiseAlttiude);
  const setMass = useSteerStore((state) => state.setMass);
  const steerInclinationAngle = useSteerOutputStore(
    (state) => state.steerInclinationAngle
  );
  const setSteerInclinationAngle = useSteerOutputStore(
    (state) => state.setSteerInclinationAngle
  );
  useEffect(() => {
    let Cz = getCzFromVelocity({
      cruiseVelocity,
      cruiseAlttiude,
      mass,
      wingSurface,
    });
    console.log(Cz);

    var closestCz = closest(Cz, Cz_array);

    // var alfa1 = data.alfa[Cz_array.findIndex((val) => val == closestCz[0])];
    // var alfa2 = data.alfa[Cz_array.findIndex((val) => val == closestCz[1])];

    // var alfaNew =
    //   (alfa1 * closestCz[0] + alfa2 * closestCz[1]) /
    //   (2 * (closestCz[0] + closestCz[1]));
    // console.log(closestCz, Cz);
    // console.log(alfa1, alfa2, alfaNew);

    let Cmbu = cmbuArray[Cz_array.findIndex((val) => val == closestCz[0])];

    console.log(Cmbu);
    setSteerInclinationAngle(
      calculateSteerIncilinationAngle({ kappa, a1, a, dEpsTodAlfa, Cmbu, Cz })
    );
  }, []);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        {" "}
        Steer inclination angle: alfa_h = {steerInclinationAngle.toPrecision(2)}
      </button>
      <div className="collapse-content">
        <OverwritableInputNumber
          value={cruiseAlttiude}
          setter={setCruiseAlttiude}
          label="Curise alttitude"
          unit="m"
          span={100}
        />

        <OverwritableInputNumber
          value={cruiseVelocity}
          setter={setCruiseVelocity}
          label="Curise velocity"
          unit="m/s"
          span={10}
        />

        <OverwritableInputNumber
          value={mass}
          setter={setMass}
          label="Mass"
          unit="kg"
          span={100}
        />
      </div>
    </div>
  );
};

export default StabillitySteerAngleOfIncilination;
