import React, { useEffect } from "react";
import InputNumber from "../../common/InputNumber";
import OverwritableInputNumber from "../../../components/atoms/OverwritableInputNumber";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import {
  useSteerOutputStore,
  useSteerStore,
} from "../../../data/stores/useSteer";
import { calculateKappa } from "../../../utils/steerCalculation/steerCalculation";
import DropdownSelect from "../../../components/atoms/DropdownSelect";
import CollapseHeader from "../../../components/atoms/CollapseHeader";

const StabillitySteerKappaDataColapse = () => {
  const xh = useSteerStore((state) => state.x_h);
  const setXh = useSteerStore((state) => state.setX_h);
  const sh = useSteerStore((state) => state.sh);
  const setSh = useSteerStore((state) => state.setSh);
  const configuration = useSteerStore((state) => state.speedDifference);
  const setVelocityDifferenece = useSteerStore(
    (state) => state.setSpeedDifference
  );
  const mac = useLongitudalMomentStore((state) => state.c_a);
  const cog = useLongitudalMomentStore((state) => state.x_sc);
  const s = useLongitudalMomentStore((state) => state.S);
  const kappa = useSteerOutputStore((state) => state.kappa);
  const setKappa = useSteerOutputStore((state) => state.setKappa);
  const rudderConfiguration = [
    { name: "T-tail", value: 0.98 },
    { name: "Elevator in fuselage axis", value: 0.9 },
    { name: "Elevator below fuselage axis", value: 0.85 },
  ];
  useEffect(() => {
    setKappa(calculateKappa({ s, sh, configuration, mac, xh, cog }));
  }, [cog, configuration, mac, s, setKappa, sh, xh]);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title">
        <CollapseHeader
          collapseTittle={
            "The volumetric feature of the horizontal stabillizer"
          }
          outputLabel={"\u03BA = "}
          caluclatedValue={kappa}
        />
      </button>
      <div className="collapse-content ">
        <OverwritableInputNumber
          value={xh}
          setter={setXh}
          label="Distance between Stabilizer 1/4 of MAC and wing 1/4 MAC"
          unit="m"
        />

        <DropdownSelect
          label="Choose elevator cofiguration"
          options={rudderConfiguration}
          setter={setVelocityDifferenece}
        />

        <InputNumber
          value={sh}
          setter={setSh}
          label="Elevator area"
          unit="m^2"
          step={0.5}
        />

        <label className="label">
          <span className="label-text"> Mean aerodynamic cord: {mac} m </span>
        </label>

        <label className="label">
          <span className="label-text"> Center od gravity: {cog} </span>
        </label>

        <label className="label">
          <span className="label-text"> Wing Surface: {s} m^2 </span>
        </label>
      </div>
    </div>
  );
};

export default StabillitySteerKappaDataColapse;
