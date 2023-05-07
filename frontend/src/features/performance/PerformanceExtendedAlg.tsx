import { useEffect, useState } from "react"
import { usePower } from "../power_unit/usePower";
import InputNumber from "../../components/atoms/InputNumber";
import { useExtendedStore } from "./useExtended";
import { useInitialStore } from "./useInitial";
import axios from "axios";
import PerformanceExtendedChart from "./PerformanceExtendedChart";

const PerformanceExtendedAlg = () => {
    const flightAltitude = useInitialStore((state) => state.flightAltitude)
    const [calculatePower] = usePower();
    const [maxPower, setMaxPower] = useState(calculatePower(0))
    
    useEffect(() => {
      setMaxPower(() => calculatePower(flightAltitude))
    }, [flightAltitude, calculatePower])

    const method_type = useExtendedStore((state) => state.method_type)
    const proptype = useExtendedStore((state) => state.proptype)
    const propnumber = useInitialStore((state) => state.propnumber)
    const nominalPower = useInitialStore((state) => state.nominalPower)

    const startMass = useInitialStore((state) => state.startMass)
    const fuelMass = useInitialStore((state) => state.fuelMass)
    const fuelcons = useInitialStore((state) => state.fuelcons)
    const vmax = useInitialStore((state) => state.vmax)
    const wmax = useInitialStore((state) => state.wmax)
    const area  = useInitialStore((state) => state.area)
    const aspectRatio = useInitialStore((state) => state.aspectRatio)
    const cx0 = useInitialStore((state) => state.cx0)
    const czmax = useInitialStore((state) => state.czmax)

    const setFlightAltitude = useInitialStore((state) => state.setFlightAltitude)

    const setMethodType = useExtendedStore((state) => state.setMethodType)
  
    const [traceExt, setTraceExt] = useState(
      {
        xes: [],
        yes: [],
        zes: [],
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
      setTraceExt((prevState) => ({
        ...prevState,
        xes: response.data.xes,
        yes: response.data.yes,
        zes: response.data.zes,
      }))};



    return (
      <div className="flex">
        <div className="flex flex-col w-64 mr-8 space-y-2">
          <form className="add-form gap-5" onSubmit={onSubmit}>
              <label className="label">
                <span className="label-text">Select mass estimation method:</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={method_type}
                name="proptype"
                id="propselect"
                onChange={(e) => setMethodType(e.target.value)}
              >
                <option value="authors">Author's</option>
                <option value="raymer">Raymer's</option>
                <option value="paturski">Paturski's</option>
              </select>
            <InputNumber
              value={flightAltitude}
              setter={setFlightAltitude}
              step={0.1}
              label="Height"
              unit="km"
            />
            <InputNumber
              value={maxPower}
              setter={() => {}}
              step={50}
              label="Max Power (IAW Performance Engine)"
              unit="kW"
            />
            <div className="break"></div>
            <input type="submit" value="Save Inputs" className="btn w-full flex items-center justify-center align-self-center"  />
          </form>
        </div>
        <div className="flex flex-col w-64 mr-8 space-y-2">
        <PerformanceExtendedChart
          trace={traceExt}
        />
      </div>
      </div>
    )
  }
  
  export default PerformanceExtendedAlg