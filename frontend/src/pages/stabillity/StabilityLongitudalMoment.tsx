import React from "react";
import {
  useLongitudalMomentOutput,
  useLongitudalMomentStore,
  usePositiveOutput,
} from "../../data/stores/useLongitudalMoment";
import { longitudalMoment } from "../../utils/longitudinalMomentCalculation/longitudalMomentCalculator";
import { useState, useEffect } from "react";
import StabillityLongitutudalMomentFuselageDataCollapse from "./longitudonalMoment/StabillityLongitutudalMomentFuselageDataCollapse";
import StabillityLongitutudalMomentGondoleDataCollapse from "./longitudonalMoment/StabillityLongitutudalMomentGondoleDataCollapse";
import StabillityLongitutudalMomentWingDataCollapse from "./longitudonalMoment/StabillityLongitutudalMomentWingDataCollapse";
import StabillityLongitudalMomentChart from "./longitudonalMoment/StabillityLongitudalMomentChart";
import arrayLimiter from "../../utils/longitudinalMomentCalculation/arrayLimiter";
const StabilityLongitudalMoment = () => {
  const [showGondole, setShowGondole] = useState(false);
  const data = useLongitudalMomentStore();
  const postiveOutput = usePositiveOutput();
  const cmbu = useLongitudalMomentOutput((state) => state.cmbu);
  const setCmbu = useLongitudalMomentOutput((state) => state.setCmbu);
  const setFuselageNeutralPoint = useLongitudalMomentOutput(
    (state) => state.setFuselageNeutralPoint
  );

  useEffect(() => {
    let longitudalMomentParams = longitudalMoment(data, showGondole);
    setCmbu(longitudalMomentParams.cmbu);
    setFuselageNeutralPoint(longitudalMomentParams.deltaXFuselage);
  }, [data, showGondole, setCmbu]);

  useEffect(() => {
    let positveAero = arrayLimiter(data.cz, cmbu, data.alfa, data.cx);
    postiveOutput.setAlfa(positveAero.alfa);
    postiveOutput.setCx(positveAero.cx);
    postiveOutput.setCz(positveAero.cz);
    postiveOutput.setCmbu(positveAero.cmbu);
  }, [data.cz, cmbu, data.alfa, data.cx]);
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl m-2">
        Longitudinal Moment Coefficient Without Stabilizer{" "}
      </h1>
      <div className="flex flex-row">
        <div className="flex flex-col w-80 mr-8 space-y-2">
          <StabillityLongitutudalMomentWingDataCollapse />
          <StabillityLongitutudalMomentFuselageDataCollapse />
          <label className="label w-60">
            <input
              type="checkbox"
              className="checkbox"
              onChange={() => {
                setShowGondole((current) => !current);
              }}
              checked={showGondole}
            />
            <span className="label-text">Gondole longitudal moment</span>
          </label>
          {showGondole && <StabillityLongitutudalMomentGondoleDataCollapse />}
        </div>
        <StabillityLongitudalMomentChart />
      </div>
    </div>
  );
};

export default StabilityLongitudalMoment;
