import InputNumber from "../atoms/InputNumber";
import {usePropellerStore } from "../../utils/usePropeller";


const PowerUnitPropeller = () => {
    const maxAirSpeed = usePropellerStore((state) => state.maxAirSpeed)
    const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude)
    const setMaxAirSpeed = usePropellerStore((state) => state.setMaxAirSpeed)
    const setCruiseAltitude = usePropellerStore((state) => state.setCruiseAltitude)
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          value={maxAirSpeed}
          setter={setMaxAirSpeed}
          label="Max Airspeed"
          unit="m/s"
        />
        <InputNumber
          value={cruiseAltitude}
          setter={setCruiseAltitude}
          label="Cruise Altitude"
          unit="km"
        />
      </div>
    </div>
  );
};

export default PowerUnitPropeller