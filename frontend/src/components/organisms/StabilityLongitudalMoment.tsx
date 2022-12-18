import React from "react";

import { useState } from "react";
import StabillityLongitutudalMomentFuselageDataCollapse from "../molecules/StabillityLongitutudalMomentFuselageDataCollapse";
import StabillityLongitutudalMomentWingDataCollapse from "../molecules/StabillityLongitutudalMomentWingDataCollapse";

const StabilityLongitudalMoment = () => {

  return (
    <div>
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <StabillityLongitutudalMomentWingDataCollapse/>
        <StabillityLongitutudalMomentFuselageDataCollapse/>
      </div>
    </div>
  );
};

export default StabilityLongitudalMoment;
