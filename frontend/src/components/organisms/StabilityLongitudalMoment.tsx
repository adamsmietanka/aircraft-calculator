import React from 'react'
import { useLongitudalMomentStore } from '../../utils/useLongitudalMoment';

import InputNumber from "../atoms/InputNumber";

const StabilityLongitudalMoment = () => {
const cm0p = useLongitudalMomentStore((state) => state.cm0p)
const setCm0p = useLongitudalMomentStore((state) => state.setCm0p)
  return (
    <div>
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          value={cm0p}
          setter={setCm0p}
          label="Cm0 profile"
          unit="-"
        />
      </div>
      
    </div>
)}

export default StabilityLongitudalMoment
