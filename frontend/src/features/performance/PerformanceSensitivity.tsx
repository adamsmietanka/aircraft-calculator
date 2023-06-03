import { useInitialStore } from "./useInitial";
import { useState, useEffect } from "react";
import PerformanceSensitivityRangeChart from "./PerformanceSensitivityRangeChart";
import PerformanceSensitivityEnduranceChart from "./PerformanceSensitivityEnduranceChart";
import axios from "axios";
import { useSensitivityStore } from "./useSensitivity";
import { usePower } from "../power_unit/hooks/usePower";



const PerformanceSensitivity = () => {
  const method_type = useSensitivityStore((state) => state.method_type)
  const proptype = useInitialStore((state) => state.proptype)
  const propnumber = useInitialStore((state) => state.propnumber)
  const nominalPower = useInitialStore((state) => state.nominalPower)
  const flightAltitude = useInitialStore((state) => state.flightAltitude)
  const startMass = useInitialStore((state) => state.startMass)
  const fuelMass = useInitialStore((state) => state.fuelMass)
  const fuelcons = useInitialStore((state) => state.fuelcons)
  const vmax = useInitialStore((state) => state.vmax)
  const wmax = useInitialStore((state) => state.wmax)
  const area  = useInitialStore((state) => state.area)
  const aspectRatio = useInitialStore((state) => state.aspectRatio)
  const cx0 = useInitialStore((state) => state.cx0)
  const czmax = useInitialStore((state) => state.czmax)

  const setMethodType = useSensitivityStore((state) => state.setMethodType)

  const [calculatePower] = usePower();
  const [maxPower, setMaxPower] = useState(calculatePower(0))

  useEffect(() => {
    setMaxPower(() => calculatePower(flightAltitude))
  }, [flightAltitude, calculatePower])

  
  const [traceSens, setTraceSens] = useState(
    {
      xes: [],
      yes: [],
      yes2: [],
      yes3: [],
      zes: [],
      zes2: [],
      zes3: [],
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      method_type,
      proptype,
      propnumber,
      nominalPower,
      flightAltitude,
      startMass,
      fuelMass,
      fuelcons,
      vmax,
      wmax,
      area,
      aspectRatio,
      cx0,
      czmax,
      maxPower
    });
    let response = await axios.post("http://127.0.0.1:8000", {
    method_type,
    proptype,
    propnumber,
    nominalPower,
    flightAltitude,
    startMass,
    fuelMass,
    fuelcons,
    vmax,
    wmax,
    area,
    aspectRatio,
    cx0,
    czmax,
    maxPower
    })
    console.log(response.data)
    setTraceSens((prevState) => ({
      ...prevState,
      xes: response.data.xes,
      yes: response.data.yes,
      yes2: response.data.yes2,
      yes3: response.data.yes3,
      zes: response.data.zes,
      zes2: response.data.zes2,
      zes3: response.data.zes3,
    }))};

    return (
      <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <form className="add-form gap-5" onSubmit={onSubmit}>
            <label className="label">
              <span className="label-text">Choose sensitivity parameter:</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={method_type}
              name="method_type"
              id="propselect"
              onChange={(e) => setMethodType(e.target.value)}
            >
              <option value='sensitivity-start-mass'>Start Mass</option>
              <option value="sensitivity-fuel-mass">Fuel Mass</option>
              <option value="sensitivity-SFC">SFC</option>
              <option value="sensitivity-eff">Efficiency (Propeller only)</option>
            </select>
            <input type="submit" value="Submit" className="btn w-full flex items-center justify-center align-self-center"  />
        </form>
      </div> 
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <PerformanceSensitivityRangeChart
        trace={traceSens}
        />
        <PerformanceSensitivityEnduranceChart
        trace={traceSens}
        />
      </div>


      </div>

  


    )
  }
  
  export default PerformanceSensitivity