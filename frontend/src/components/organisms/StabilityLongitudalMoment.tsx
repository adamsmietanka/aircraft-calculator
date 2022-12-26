import React from "react";
import {useLongitudalMomentOutput, useLongitudalMomentStore } from "../../utils/useLongitudalMoment";
import {longitudalMoment} from "../../utils/longitudalMomentCalculator"
import { useState, useEffect} from "react";
import StabillityLongitutudalMomentFuselageDataCollapse from "../molecules/StabillityLongitutudalMomentFuselageDataCollapse";
import StabillityLongitutudalMomentGondoleDataCollapse from "../molecules/StabillityLongitutudalMomentGondoleDataCollapse";
import StabillityLongitutudalMomentWingDataCollapse from "../molecules/StabillityLongitutudalMomentWingDataCollapse";
import StabillityLongitudalMomentChart from "../molecules/StabillityLongitudalMomentChart";

const StabilityLongitudalMoment = () => {
  const [showGondole, setShowGondole] = useState(false);
  const data = useLongitudalMomentStore()
  const setCmbu = useLongitudalMomentOutput((state)=>state.setCmbu)
  const cmbu = useLongitudalMomentOutput((state)=>state.cmbu)
  useEffect (()=>{
    setCmbu(longitudalMoment(data))
    console.log(cmbu)
  },[data])
  return (
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
      <StabillityLongitudalMomentChart/>
    </div>
  );
};

export default StabilityLongitudalMoment;
