import React, { useEffect } from "react";
import { calculateDelta } from "../../utils/steerCalculation";
import {
  useLongitudalMomentOutput,
  useLongitudalMomentStore,
} from "../../utils/useLongitudalMoment";
import { useSteerOutputStore, useSteerStore } from "../../utils/useSteer";
import StabillitySteerAfterWingFlowAngleDataCollapse from "../molecules/StabillitySteerAfterWingFlowAngleDataCollapse";
import StabillitySteerAngleOfIncilination from "../molecules/StabillitySteerAngleOfIncilination";
import StabillitySteerChart from "../molecules/StabillitySteerChart";
import StabillitySteerCooficientsDataCollapse from "../molecules/StabillitySteerCooficientsDataCollapse";
import StabillitySteerKappaDataColapse from "../molecules/StabillitySteerKappaDataColapse";

const StabillitySteer = () => {
  const delta = useSteerOutputStore((state) => state.delta);

  const Cmbu = useLongitudalMomentOutput((state) => state.cmbu);
  const cz = useLongitudalMomentStore((state) => state.cz);
  const a = useSteerStore((state) => state.a);
  const a1 = useSteerOutputStore((state) => state.a1);
  const a2 = useSteerOutputStore((state) => state.a2);
  const kappa = useSteerOutputStore((state) => state.kappa);
  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const steerIncilinationAngle = useSteerOutputStore(
    (state) => state.steerInclinationAngle
  );

  const setDelta = useSteerOutputStore((state) => state.setDelta);
  useEffect(() => {
    setDelta(
      calculateDelta({
        Cmbu,
        cz,
        a,
        a1,
        a2,
        kappa,
        dEpsTodAlfa,
        steerIncilinationAngle,
      })
    );
    console.log(delta);
  }, [
    setDelta,
    Cmbu,
    cz,
    a,
    a1,
    a2,
    kappa,
    dEpsTodAlfa,
    steerIncilinationAngle,
  ]);
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <StabillitySteerKappaDataColapse />
        <StabillitySteerCooficientsDataCollapse />
        <StabillitySteerAfterWingFlowAngleDataCollapse />
        <StabillitySteerAngleOfIncilination />
      </div>
      <StabillitySteerChart />
    </div>
  );
};

export default StabillitySteer;
