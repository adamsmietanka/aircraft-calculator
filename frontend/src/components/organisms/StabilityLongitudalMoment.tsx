import React from "react";

import { useState } from "react";
import StabillityLongitutudalMomentFuselageDataCollapse from "../molecules/StabillityLongitutudalMomentFuselageDataCollapse";
import StabillityLongitutudalMomentGondoleDataCollapse from "../molecules/StabillityLongitutudalMomentGondoleDataCollapse";
import StabillityLongitutudalMomentWingDataCollapse from "../molecules/StabillityLongitutudalMomentWingDataCollapse";

const StabilityLongitudalMoment = () => {
  const [showGondole, setShowGondole] = useState(false);
  return (
    <div>
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
    </div>
  );
};

export default StabilityLongitudalMoment;
