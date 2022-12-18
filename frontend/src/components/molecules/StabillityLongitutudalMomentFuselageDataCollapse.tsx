import React from 'react'
import { useLongitudalMomentStore } from "../../utils/useLongitudalMoment";

import InputNumber from "../atoms/InputNumber";
const StabillityLongitutudalMomentFuselageDataCollapse = () => {

  return (
    <div tabIndex={0} className="collapse border rounded-box">
    <input type="checkbox" />
    <button className="collapse-title text-xl font-medium"> Fuselage Longitudal Moment</button>
    <div className="collapse-content ">

    </div>
  </div>
  )
}

export default StabillityLongitutudalMomentFuselageDataCollapse
