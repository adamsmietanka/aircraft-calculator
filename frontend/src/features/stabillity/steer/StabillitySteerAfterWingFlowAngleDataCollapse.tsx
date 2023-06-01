import React, { useEffect } from "react";
import { calculateDepsToDalfa } from "../../../utils/steerCalculation/steerCalculation";
import {
  useSteerOutputStore,
  useSteerStore,
} from "../../../data/stores/useSteer";
import OverwritableInputNumber from "../../../components/atoms/OverwritableInputNumber";
import CollapseHeader from "../../../components/atoms/CollapseHeader";

const StabillitySteerAfterWingFlowAngleDataCollapse = () => {
  const wingAspectRatio = useSteerStore((state) => state.wingAspectRatio);
  const a = useSteerStore((state) => state.a);
  const setWingAspectRatio = useSteerStore((state) => state.setWingAspectRatio);
  const setA = useSteerStore((state) => state.setA);

  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const setDEpsTodAlfa = useSteerOutputStore((state) => state.setDEpsTodAlfa);

  useEffect(() => {
    setDEpsTodAlfa(calculateDepsToDalfa({ a, wingAspectRatio }));
  }, [wingAspectRatio, a]);
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title ">
        <CollapseHeader
          collapseTittle={"The disipation angle of the flow after wing"}
          outputLabel={"d\u03B5/d\u03B1 = "}
          caluclatedValue={dEpsTodAlfa}
        />
      </button>
      <div className="collapse-content">
        <OverwritableInputNumber
          value={a}
          setter={setA}
          label="Wing Cx(&alpha;) slope"
          unit="1/rad"
          span={0.3}
        />

        <OverwritableInputNumber
          value={wingAspectRatio}
          setter={setWingAspectRatio}
          label="Wing aspect ratio"
          unit="-"
          span={0.1}
        />
      </div>
    </div>
  );
};

export default StabillitySteerAfterWingFlowAngleDataCollapse;
