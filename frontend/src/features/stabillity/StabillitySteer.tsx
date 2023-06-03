import React, { useEffect } from "react";
import {
  calculateDelta,
  calculateSteerIncilinationAngle,
} from "../../utils/steerCalculation/steerCalculation";
import {
  useLongitudalMomentOutput,
  useLongitudalMomentStore,
  usePositiveOutput,
} from "../../data/stores/useLongitudalMoment";
import { useSteerOutputStore, useSteerStore } from "../../data/stores/useSteer";
import StabillitySteerAfterWingFlowAngleDataCollapse from "./steer/StabillitySteerAfterWingFlowAngleDataCollapse";
import StabillitySteerAngleOfIncilination from "./steer/StabillitySteerAngleOfIncilination";
import StabillitySteerChart from "./steer/StabillitySteerChart";
import StabillitySteerCooficientsDataCollapse from "./steer/StabillitySteerCooficientsDataCollapse";
import StabillitySteerKappaDataColapse from "./steer/StabillitySteerKappaDataColapse";
import velocity from "../../utils/steerCalculation/velocity";
import { useForceOnTheRodStore } from "../../data/stores/useForceOnTheRod";
import { density } from "../../utils/atmosphere";

function getAlfaH(
  CmbuArray: number[],
  CzArray: number[],
  kappa: number,
  a1: number,
  a: number,
  dEpsTodAlfa: number
) {
  let alfaHArray = CmbuArray.map((curr) => curr);
  for (let i = 0; i < CmbuArray.length; i++) {
    let Cmbu = CmbuArray[i];
    let Cz = CzArray[i];
    alfaHArray[i] = calculateSteerIncilinationAngle({
      kappa,
      a1,
      a,
      dEpsTodAlfa,
      Cmbu,
      Cz,
    });
  }
  return alfaHArray;
}

const StabillitySteer = () => {
 const cruiseAlttiude = useSteerStore((state) => state.cruiseAlttiude);
  const mass = useSteerStore((state) => state.mass);
  const wingSurface = useLongitudalMomentStore((state) => state.S);
  const setVelocity = useForceOnTheRodStore((state) => state.setVelocity);

  const delta = useSteerOutputStore((state) => state.delta);


  const a = useSteerStore((state) => state.a);
  const a1 = useSteerOutputStore((state) => state.a1);
  const a2 = useSteerOutputStore((state) => state.a2);
  const kappa = useSteerOutputStore((state) => state.kappa);
  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const steerIncilinationAngle = useSteerOutputStore(
    (state) => state.steerInclinationAngle
  );


  const CmbuArray = usePositiveOutput((state) => state.cmbu);
  const CzArray = usePositiveOutput((state) => state.cz);
  const setDelta = useSteerOutputStore((state) => state.setDelta);
  const setAlfaH = useSteerOutputStore((state) => state.setAlfaH);
  
  useEffect(()=>{setVelocity(CzArray.map((cz)=>(velocity(cz,density(cruiseAlttiude),wingSurface,mass))))},[CzArray,cruiseAlttiude,mass,wingSurface])

  useEffect(() => {
    setAlfaH(getAlfaH(CmbuArray, CzArray, kappa, a1, a, dEpsTodAlfa));
  }, [CzArray, CzArray, kappa, a1, a, dEpsTodAlfa]);

  useEffect(() => {
    setDelta(
      calculateDelta({
        CmbuArray,
        CzArray,
        a,
        a1,
        a2,
        kappa,
        dEpsTodAlfa,
        steerIncilinationAngle,
      })
    );
    console.log(CzArray.length)
    console.log(delta.length);
  }, [
    setDelta,
    CmbuArray,
    CzArray,
    a,
    a1,
    a2,
    kappa,
    dEpsTodAlfa,
    steerIncilinationAngle,
  ]);
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl m-2">Elevator Angle Calculation</h1>
      <div className="flex flex-row">
        <div className="flex flex-col w-80 mr-8 space-y-2">
          <StabillitySteerKappaDataColapse />
          <StabillitySteerCooficientsDataCollapse />
          <StabillitySteerAfterWingFlowAngleDataCollapse />
          <StabillitySteerAngleOfIncilination />
        </div>
        <div className="flex flex-col">
          <StabillitySteerChart />
        </div>
      </div>
    </div>
  );
};

export default StabillitySteer;
