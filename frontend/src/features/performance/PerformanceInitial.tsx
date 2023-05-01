import InputNumber from "../../components/atoms/InputNumber";
import InputSlider from "../../components/atoms/InputSlider";
import InputSwitch from "../../utils/performance/InputSwitch"
import { useInitialStore } from "./useInitial";
import PerformanceInitialRangeChart from "./PerformanceInitialRangeChart";
import PerformanceInitialEnduranceChart from "./PerformanceInitiaEndurancelChart";

const PerformanceInitial = () => {
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
  const setProptype = useInitialStore((state) => state.setProptype)
  const setPropnumber = useInitialStore((state) => state.setPropnumber)
  const setNominalPower = useInitialStore((state) => state.setNominalPower)
  const setFlightAltitude = useInitialStore((state) => state.setFlightAltitude)
  const setStartMass = useInitialStore((state) => state.setStartMass)
  const setFuelMass = useInitialStore((state) => state.setFuelMass)
  const setFuelcons = useInitialStore((state) => state.setFuelcons)
  const setVmax = useInitialStore((state) => state.setVmax)
  const setWmax = useInitialStore((state) => state.setWmax)
  const setArea = useInitialStore((state) => state.setArea)
  const setAspectRatio = useInitialStore((state) => state.setAspectRatio)
  const setCx0 = useInitialStore((state) => state.setCx0)
  const setCzmax = useInitialStore((state) => state.setCzmax)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
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
      czmax
      );
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <form className="add-form gap-5" onSubmit={onSubmit}>
            <label className="label">
              <span className="label-text">Select propulsion type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={proptype}
              name="proptype"
              id="propselect"
              onChange={(e) => setProptype(e.target.value)}
            >
              <option value="propeller">Propeller</option>
              <option value="jet">Jet</option>
            </select>

          <InputNumber
            value={propnumber}
            setter={setPropnumber}
            step={1}
            label="Number of Engines"
            unit="-"
          />
          <InputNumber
            value={nominalPower}
            setter={setNominalPower}
            step={0.1}
            label="Nominal Power"
            unit="kW"
          />
          <InputNumber
            value={startMass}
            setter={setStartMass}
            step={0.01}
            label="Start Mass"
            unit="kg"
          />
          <InputNumber
            value={fuelMass}
            setter={setFuelMass}
            step={1}
            label="Mass of Fuel"
            unit="kg"
          />
          <InputNumber
            value={fuelcons}
            setter={setFuelcons}
            step={0.001}
            label="SFC"
            unit="kg/kWh"
          />
          <InputNumber
            value={vmax}
            setter={setVmax}
            step={0.01}
            label="Max Velocity"
            unit="m/s"
          />
          <InputNumber
            value={wmax}
            setter={setWmax}
            step={0.01}
            label="Rate of Climb"
            unit="m/s"
          />
          <InputNumber
            value={area}
            setter={setArea}
            step={0.001}
            label="Wing area"
            unit="m^2"
          />
          <InputNumber
            value={aspectRatio}
            setter={setAspectRatio}
            step={0.001}
            label="Aspect Ratio"
            unit="-"
          />
          <InputNumber
            value={cx0}
            setter={setCx0}
            step={0.0001}
            label="Minimal Drag Coefficient"
            unit="-"
          />
          <InputNumber
            value={czmax}
            setter={setCzmax}
            step={0.001}
            label="Maximal Lift Coefficient"
            unit="-"
          />
          <InputSlider
            label="Flight altitude"
            unit="km"
            value={flightAltitude}
            min={0}
            max={15}
            setter={setFlightAltitude} 
          />
          <div className="break"></div>
          <input type="submit" value="Save Inputs" className="btn w-full flex items-center justify-center align-self-center"  />
        </form>
      </div> 
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <PerformanceInitialRangeChart/>
        <PerformanceInitialEnduranceChart/>
      </div>
    </div>
  );
};

export default PerformanceInitial;