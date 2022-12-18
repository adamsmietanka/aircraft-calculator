import React, { useState } from "react";
import { useLongitudalMomentStore } from "../../utils/useLongitudalMoment";

import InputNumber from "../atoms/InputNumber";
import OverwriteCheckbox from "../atoms/OvrwriteCheckbox";
import ReadCSV from "../atoms/ReadCSV";
const StabillityLongitutudalMomentWingDataCollapse = () => {
  const data = useLongitudalMomentStore()
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        {" "}
        Wing Longitudal Moment
      </button>
      <div className="collapse-content ">
        <InputNumber
          value={data.cm0p}
          setter={data.setCm0p}
          label="Cm0 profile"
          unit="-"
        />
        <OverwriteCheckbox label ="Get Cm_0 value from previous calculation"/>
        <ReadCSV/>
        <OverwriteCheckbox label ="Get Cx(alfa) anz Cz_p(alfa) value from previous calculation"/>
        
        <InputNumber
          value={data.x_sa}
          setter={data.setX_sa}
          label="Center of aerodynamic force x cordiante"
          unit="-"
        />
        <OverwriteCheckbox label ="Get x_sa value from previous calculation"/>
        <InputNumber
          value={data.x_sc}
          setter={data.setX_sc}
          label="Center of gravity x cordiante"
          unit="-"
        />
        <OverwriteCheckbox label ="Get x_sc value from previous calculation"/>
        <InputNumber
          value={data.z_sa}
          setter={data.setZ_sa}
          label="Center of aerodynamic force z cordiante"
          unit="-"
        />
        <OverwriteCheckbox label ="Get Z_sa value from previous calculation"/>
        <InputNumber
          value={data.z_sc}
          setter={data.setZ_sc}
          label="Center of gravity z cordiante"
          unit="-"
        />
        <OverwriteCheckbox label ="Get z_sc value from previous calculation"/>
      </div>
    </div>
  );
};

export default StabillityLongitutudalMomentWingDataCollapse;
