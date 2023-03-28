import React from 'react'
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";

import InputNumber from "../../../components/atoms/InputNumber";
import OverwritableInputNumber from '../../../components/atoms/OverwritableInputNumber';

const StabillityLongitutudalMomentFuselageDataCollapse = () => {
  const data = useLongitudalMomentStore() 
  return (
    <div tabIndex={0} className="collapse border rounded-box">
    <input type="checkbox" />
    <button className="collapse-title text-xl font-medium"> Fuselage Longitudal Moment</button>
    <div className="collapse-content ">

    <InputNumber
          value={data.s_b}
          setter={data.setS_b}
          label="Top view fuselage surface"
          unit="m^2"
        />

    <InputNumber
          value={data.s_bf}
          setter={data.setS_bf}
          label="Front fuselage part top view surface"
          unit="m^2"
        />

    <InputNumber
          value={data.w}
          setter={data.setW}
          label="Fuselage width"
          unit="m"
        />

    <InputNumber
          value={data.l_b}
          setter={data.setL_b}
          label="Fuselage length"
          unit="m"
        />

    <InputNumber
          value={data.l_bf}
          setter={data.setL_bf}
          label="Fuselagwe front part lenght"
          unit="m"
        />

    <InputNumber
          value={data.i_w}
          setter={data.setI_w}
          label="Wing incilnation"
          unit="rad"
        />

    <OverwritableInputNumber
          value={data.c_a}
          setter={data.setC_a}
          label="Wing mean aerodynamic cord"
          unit="m"
          span={0.5}
        />
    
    <OverwritableInputNumber
          value={data.S}
          setter={data.setS}
          label="Wing surface"
          unit="m^2"
          span = {1}/>

    <OverwritableInputNumber
          value={data.c_0}
          setter={data.setC0}
          label="Wing cord in the fuselage axis"
          unit="m"
          span= {0.5}
        />
    <InputNumber
          value={data.b_k}
          setter={data.setb_k}
          label="Width of the fuselage in the place where wings come"
          unit="m"
        />
    </div>
  </div>
  )
}

export default StabillityLongitutudalMomentFuselageDataCollapse
