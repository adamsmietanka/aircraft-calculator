import React, { useEffect } from "react";
import {
  calculateSteerIncilinationAngle,
  getCzFromVelocity,
} from "../../../utils/steerCalculation/steerCalculation";
import {
  useLongitudalMomentStore,
  useLongitudalMomentOutput,
} from "../../../data/stores/useLongitudalMoment";
import {
  useSteerOutputStore,
  useSteerStore,
} from "../../../data/stores/useSteer";
import OverwritableInputNumber from "../../../components/atoms/OverwritableInputNumber";
import CollapseHeader from "../../../components/atoms/CollapseHeader";

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
  //tutaj poprawne wszystkie
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
    console.log("Claculeted Cz:",Cz);

    let closestCz = closest(Cz, Cz_array);
    console.log("Closest Cz in the array:",closestCz);
    let Cmbu = cmbuArray[Cz_array.findIndex((val) => val === closestCz[0])];
    console.log("Cmbu for the closest Cz:",Cmbu);
    setSteerInclinationAngle(
      calculateSteerIncilinationAngle({ kappa, a1, a, dEpsTodAlfa, Cmbu, Cz })
    );
  }, [
    kappa,
    a1,
    a,
    dEpsTodAlfa,
    Cz_array,
    cruiseVelocity,
    cruiseAlttiude,
    mass,
    wingSurface,
    cmbuArray,
    setSteerInclinationAngle
  ]);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title">
        {" "}
        <CollapseHeader
          collapseTittle={"Steer inclination angle"}
          outputLabel={"\u03B1_H = "}
          caluclatedValue={steerInclinationAngle}
          unit={"rad"}
        />
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
