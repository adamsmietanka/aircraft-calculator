import InputNumber from "../atoms/InputNumber";
import SelectType from "../atoms/SelectType";
import {usePropellerStore } from "../../utils/usePropeller";


const PowerUnitPropeller = () => {
    const maxAirSpeed = usePropellerStore((state) => state.maxAirSpeed)
    const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude)
    const diameterType = usePropellerStore((state) => state.diameterType)
    const setMaxAirSpeed = usePropellerStore((state) => state.setMaxAirSpeed)
    const setCruiseAltitude = usePropellerStore((state) => state.setCruiseAltitude)
    const setDiameterType = usePropellerStore((state) => state.setDiameterType)
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          label="Max Airspeed"
          unit="m/s"
          value={maxAirSpeed}
          setter={setMaxAirSpeed}
        />
        <InputNumber
          label="Cruise Altitude"
          unit="km"
          value={cruiseAltitude}
          setter={setCruiseAltitude}
        />
        <SelectType
          label="Select diameter calculation type"
          type={diameterType}
          option1='Optimized'
          option2='Manual'
          setter={setDiameterType}
        />
      </div>
    </div>
  );
};

export default PowerUnitPropeller