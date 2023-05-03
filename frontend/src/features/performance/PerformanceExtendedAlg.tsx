import { useEffect, useState } from "react"
import { usePower } from "../power_unit/usePower";
import InputNumber from "../../components/atoms/InputNumber";

const PerformanceExtendedAlg = () => {
    const [height, setHeight] = useState(0)
    const [calculatePower] = usePower();
    const [power, setPower] = useState(calculatePower(0))
    useEffect(() => {
      setPower(() => calculatePower(height))
    }, [height, calculatePower])
    return (
      
    <div className="flex">
    <div className="flex flex-col w-64 mr-8 space-y-2">
      <InputNumber
        value={height}
        setter={setHeight}
        step={0.1}
        label="Height"
        unit="km"
      />
      <InputNumber
        value={power}
        setter={() => {}}
        step={50}
        label="Power"
        unit="kW"
      />
      </div>
      </div>
    )
  }
  
  export default PerformanceExtendedAlg