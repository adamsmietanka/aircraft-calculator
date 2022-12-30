import React from 'react'
import StabillitySteerAfterWingFlowAngleDataCollapse from '../molecules/StabillitySteerAfterWingFlowAngleDataCollapse';
import StabillitySteerChart from '../molecules/StabillitySteerChart';
import StabillitySteerCooficientsDataCollapse from '../molecules/StabillitySteerCooficientsDataCollapse';
import StabillitySteerKappaDataColapse from '../molecules/StabillitySteerKappaDataColapse';

const StabillitySteer = () => {
  return (
      <div className="flex flex-row">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <StabillitySteerKappaDataColapse />
        <StabillitySteerCooficientsDataCollapse/>
        <StabillitySteerAfterWingFlowAngleDataCollapse/>
      </div>
      <StabillitySteerChart/>
    </div>
  )
}

export default StabillitySteer
