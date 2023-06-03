import React from "react";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import InputNumber from "../../common/inputs/InputNumber";

const StabillityLongitutudalMomentGondoleDataCollapse = () => {
  const data = useLongitudalMomentStore();
  return (
    <div tabIndex={0} className="collapse border rounded-box">
      <input type="checkbox" />
      <button className="collapse-title text-xl font-medium">
        Gondole Longitudal Moment
      </button>
      <div className="collapse-content ">
        <InputNumber
          value={data.s_b_g}
          setter={data.setS_b_g}
          label="Top view gondole surface"
          unit="m^2"
        />

        <InputNumber
          value={data.s_bf_g}
          setter={data.setS_bf_g}
          label="Front gondole part top view surface"
          unit="m^2"
        />

        <InputNumber
          value={data.w_g}
          setter={data.setW_g}
          label="Gondole width"
          unit="m"
        />

        <InputNumber
          value={data.l_b_g}
          setter={data.setL_b_g}
          label="Gondole length"
          unit="m"
        />

        <InputNumber
          value={data.l_bf_g}
          setter={data.setL_bf_g}
          label="Gondole front part lenght"
          unit="m"
        />

        <InputNumber
          value={data.i_w_g}
          setter={data.setI_w_g}
          label="Wing incilnation"
          unit="rad"
        />

        <InputNumber
          value={data.b_k}
          setter={data.setb_k}
          label="Width of the gondole in the place where wings come"
          unit="m"
        />
      </div>
    </div>
  );
};

export default StabillityLongitutudalMomentGondoleDataCollapse;
