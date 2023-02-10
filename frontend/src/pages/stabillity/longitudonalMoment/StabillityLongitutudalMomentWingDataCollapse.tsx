import React, { useEffect, useState } from "react";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import OverwritableInputNumber from "../../../components/atoms/OverwritableInputNumber";
import OverwriteCheckbox from "../../../components/atoms/OvrwriteCheckbox";
import ReadCSV from "../../../components/atoms/ReadCSV";
const StabillityLongitutudalMomentWingDataCollapse = () => {
  const data = useLongitudalMomentStore();
  const [aero,setAreo] = useState({alpha:[],cz:[],cx:[]})

  useEffect(()=>(console.log("aero:",aero)),[aero])
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        {" "}
        Wing Longitudal Moment
      </button>
      <div className="collapse-content ">
        <OverwritableInputNumber
          value={data.cm0p}
          setter={data.setCm0p}
          label="Cm0 profile"
          unit="-"
          span = {0.01}
        />
        
        <ReadCSV label = "Import Wing Data CSV" setter={setAreo}/>
        <OverwriteCheckbox label="Get Cx(alfa) anz Cz_p(alfa) value from previous calculation" />

        <OverwritableInputNumber
          value={data.x_sa}
          setter={data.setX_sa}
          label="Center of aerodynamic force x cordiante"
          unit="-"
          span = {0.01} 
        />
        <OverwritableInputNumber
          value={data.x_sc}
          setter={data.setX_sc}
          label="Center of gravity x cordiante"
          unit="-"
          span = {0.01}
        />
        
        <OverwritableInputNumber
          value={data.z_sa}
          setter={data.setZ_sa}
          label="Center of aerodynamic force z cordiante"
          unit="-"
          span = {0.01}
        />
        <OverwritableInputNumber
          value={data.z_sc}
          setter={data.setZ_sc}
          label="Center of gravity z cordiante"
          unit="-"
          span = {0.01}
        />
      </div>
    </div>
  );
};

export default StabillityLongitutudalMomentWingDataCollapse;
