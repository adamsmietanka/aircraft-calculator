import React from 'react'
import { useLongitudalMomentStore } from "../../utils/useLongitudalMoment";

import InputNumber from "../atoms/InputNumber";
import OverwriteCheckbox from '../atoms/OvrwriteCheckbox';
const StabillityLongitutudalMomentGondoleDataCollapse = () => {
  const data = useLongitudalMomentStore() 
  return (
    <div tabIndex={0} className="collapse border rounded-box">
    <input type="checkbox" />
    <button className="collapse-title text-xl font-medium"> Gondole Longitudal Moment</button>
    <div className="collapse-content ">

    <InputNumber
          value={data.s_b_g}
          setter={data.setS_b_g}
          label="Top view gondole surface"
          unit="m^2"
        />

    <InputNumber
          value={data.s_bf}
          setter={data.setS_bf}
          label="Front gondole part top view surface"
          unit="m^2"
        />

    <InputNumber
          value={data.w}
          setter={data.setW}
          label="Gondole width"
          unit="m"
        />

    <InputNumber
          value={data.l_b}
          setter={data.setL_b}
          label="Gondole length"
          unit="m"
        />

    <InputNumber
          value={data.l_bf}
          setter={data.setL_bf}
          label="Gondole front part lenght"
          unit="m"
        />

    <InputNumber
          value={data.i_w}
          setter={data.setI_w}
          label="Wing incilnation"
          unit="rad"
        />

    <InputNumber
          value={data.c_a}
          setter={data.setC_a}
          label="Wing mean aerodynamic cord"
          unit="m"
        />
    <OverwriteCheckbox label ="Get wing mean aerodynamic cord value from previous calculation"/>
    <InputNumber
          value={data.S}
          setter={data.setS}
          label="Wing surface"
          unit="m^2"
        />
    <OverwriteCheckbox label ="Get wing surface value from previous calculation"/>
    <InputNumber
          value={data.c_0}
          setter={data.setC0}
          label="Wing cord in the gondole axis"
          unit="m"
        />
    <OverwriteCheckbox label ="Get wing surface value from previous calculation"/>
    <InputNumber
          value={data.b_k}
          setter={data.setb_k}
          label="Width of the gondole in the place where wings come"
          unit="m"
        />
    </div>
  </div>
  )
}

export default StabillityLongitutudalMomentGondoleDataCollapse